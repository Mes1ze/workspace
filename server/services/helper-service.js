import sha256 from 'sha256';
import ProjectModel from "../models/project-model";
import TaskModel from "../models/task-model";
import ProjectHistoryService from '~/server/services/project-history-service'
import TaskHistoryService from '~/server/services/task-history-service'

const projectHistoryService = new ProjectHistoryService()
const taskHistoryService = new TaskHistoryService()

/**
 * Вспомогательный сервис.
 * 
 */
class HelperService {
    /**
     * Форматирует ответ модели для возврата из сервиса.
     * 
     * @param {*} status - код состояния HTTP
     * @param {*} data - возвращаемые данные
     * @returns Возвращает объект `{ success: ..., status: ..., message: ... }`
     */
    async resFormat(status, data) {
        let object = {
            status: status
        }
        if (status < 300){
            object.success = true
            object.data = data
            return object;
        }else if (data){
            object.message = data
        }
        object.success = false
        return object
    }

    /**
     * Хеширует пароль.
     * 
     * @param {*} password - пароль 
     * @returns Возвращает пароль, хешированный по алгоритму SHA256.
     */
    async hash(password){
        return sha256(password)
    }

    /**
     * Изменяет запись в таблице, поддерживающей формирование истории изменений.
     * 
     * @param {*} model - модель, соответствующая таблице. Может быть `ProjectModel`, `TaskModel`.
     * @param {*} id - ID записи, подлежащей изменению.
     * @param {*} newData - объект, содержащий новые данные для изменения записи.
     * @param {*} user - ID пользователя, совершающего изменение.
     * @returns Возвращает true, если изменение удалось, иначе возвращает false.
     */
    async updateWithArchive(model, id, newData, user) {
        let entryId
        let historyService
        console.log(model)
        if(model instanceof ProjectModel) {
            historyService = projectHistoryService
            entryId = "project_id"
        }
        else if(model instanceof TaskModel) {
            historyService = taskHistoryService
            entryId = "task_id"
        }
        else throw new Error("У заданной таблицы нет архива.")

        console.log('newData' + JSON.stringify(newData))

        const changed = Object.keys(newData.data).filter((key) => newData.data[key])
        let select = {}
        changed.forEach((key) => select[key] = true)

        const previousData = (await model.get({where: { id: id}, select: select}))
        console.log("!!!previous:" + JSON.stringify(previousData))

        const result = await model.update(newData)
        if(previousData && result) {
            changed.forEach(async (key) => await historyService.create({
                [entryId]: id,
                employee_id: user,
                date: Date.now(),
                field: key,
                old_value: String(previousData[key]),
                new_value: String(newData.data[key]),
            }))

            return result
        } else {
            return false
        }
    }

    /**
     * Возвращает объект выборки со всеми полями для данной модели.
     * 
     * @param {Object} model - модель, для которой строится объект выборки.
     * @param {string[]} relations - массив имён связанных полей, которые требуется выбрать.
     * @returns Возвращает построенный объект выборки.
     */
    async constructDefaultSelect(model, relations) {
        if(!model || !relations) return false

        let select = {}
        Object.keys(model.fields).forEach(key => select[key] = true)
        relations.forEach(key => select[key] = true)

        return select
    }

    /**
     * Возвращает записи с пагинацией.
     * 
     * @param {Object} model - модель, используемая для получения записей.
     * @param {Object} select - объект выборки.
     * @param {Object} where - объект фильтрации.
     * @param {Object} params - объект, содержащий параметры пагинации\
     *                          может отсутствовать, тогда будут применены значения по умолчанию.
     * @param {number|string} params.page - номер текущей страницы (начиная с 1), по умолчанию: 1.
     * @param {number|string} params.count - количество записей на страницах, по умолчанию: 10.
     * @returns 
     */
    async getAllPaginated(model, select, where, params) {
        const page = +params.page || 1
        const count = +params.count || 10

        const result = await model.findMany({
            select: select,
            where: where,
            skip: (page - 1)*count,
            take: count
        })

        const total = Math.ceil(await model.count({ where: where }) / count)

        if(result) return {
            page: page,
            count: count,
            total: total,
            result: result,
        }
        else return false
    }
}
export default new HelperService();