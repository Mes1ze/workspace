import { PrismaClient } from "@prisma/client"
import helper from "../services/helper-service"

const client = new PrismaClient()

/**
 * Модель таблицы `day_time_history` в базе данных.
 * 
 */
class DaytimeHistoryModel {
    /**
     * Создаёт новую запись в таблице `day_time_history`.
     *
     * @param {Object} data - объект, содержащий данные для записи в таблицу.
     * @param {string|number} data.type - тип записи. Может быть "`start`" (открытие смены) или "`end`" (закрытие смены).
     * @param {string|number} data.unix - таймштамп записи. Может быть опущен, тогда будет взято текущее время.
     * @param {string|number} data.employee_id - ID пользователя, чья смена открывается или закрывается.
     * @param {string|number} data.author - ID пользователя, который открыл или закрыл смену.
     * @param {string|number} data.comment - комментарий.
     * 
     * @returns Возвращает созданную запись, если её удалось создать,\
     *          иначе возвращает false
     */
    async create(data) {
        try {
            if(!["start", "end"].includes(data.type)) throw new Error(`Неверный тип записи: '${data.type}'. Допустимые значения type: 'start', 'end'.`)

            const daytimeHistory = {
                data: {
                    type        : data.type,
                    unix        : data.unix || Date.now(),
                    employee_id : +data.employee_id || undefined,
                    author      : +data.author || undefined,
                    comment     : data.comment
                }
            }
            const result = client.day_time_history.create(daytimeHistory)
            if(result) return result
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }

    /**
     * Получает множество записей из таблицы `day_time_history`.
     * 
     * @param {Object} ctx - объект, содержащий данные для формирования запроса.
     * @param {Object} ctx.select - объект, содержащий поля записей, которые будут возвращены;\
     *                              если отсутствует, будут возвращены все поля.
     * @param {Object} ctx.where - объект, содержащий критерии отбора записей;\
     *                             может отсутствовать, тогда будут выбраны все записи.
     * @param {Object} ctx.params - объект, содержащий данные о пагинации;\
     *                              может отсутствовать, тогда пагинация не будет осуществляться.
     * @param {string | number} ctx.params.page - номер текущей страницы.
     * @param {string | number} ctx.params.count - количество записей на страницах.
     * @returns Возвращает найденные записи, если они существуют,\
     *          иначе возвращает false.
     */
    async getAll(ctx) {
        try {
            const select = ctx.select ?? await helper.constructDefaultSelect(client.day_time_history, [
                "employee_day_time_history_employee_idToemployee",
                "employee_day_time_history_authorToemployee"
            ])
            const where = {
                type: ctx.type,
                employee_id: +ctx.employee_id || undefined,
                author: +ctx.author || undefined
            }
            const pagination = {
                page: +ctx.page,
                count: +ctx.count
            }
            
            const result = pagination
                ? await helper.getAllPaginated(client.day_time_history, select, where, pagination)
                : await client.day_time_history.findMany({
                    select: select,
                    where: where
                });
            

            (pagination ? result.result : result).forEach(history => {
                delete history.employee_day_time_history_employee_idToemployee.password_hash
                delete history.employee_day_time_history_authorToemployee.password_hash
            }) 

            if(result) return result
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }

    /**
     * Получает уникальную запись из таблицы `day_time_history`.
     * 
     * @param {Object} ctx - объект, содержащий данные для формирования запроса.
     * @param {Object} ctx.select - объект, содержащий поля записи, которые будут возвращены;\
     *                              если отсутствует, будут возвращены все поля.
     * @param {Object} ctx.where - объект, содержащий критерии отбора записи;\
     *                             должен присутствовать, обычно имеет поле `id`: `number`.
     * @returns Возвращает найденную запись, если она существует,\
     *          иначе возвращает false.
     */
    async get(ctx) {
        try {
            const select = ctx.select ?? await helper.constructDefaultSelect(client.day_time_history, [
                "employee_day_time_history_employee_idToemployee",
                "employee_day_time_history_authorToemployee"
            ])
            
            const result = await client.day_time_history.findUnique({
                select: select,
                where: ctx.where
            });

            try { delete result.employee_day_time_history_employee_idToemployee.password_hash } catch(e) {}
            try { delete result.employee_day_time_history_authorToemployee.password_hash } catch(e) {}

            if(result) return result
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }

    /**
     * Обновляет запись в таблице `day_time_history`.
     * 
     * @param {Object} ctx - объект, содержащий данные для обновления записи.
     * @param {Object} ctx.data - объект, содержащий новые данные для записи в таблицу.
     * @param {number|string} ctx.id - ID обновляемой записи.
     * @returns Возвращает обновлённую запись в случае успешного обновления,\
     *          иначе возвращает false.
     */
    async update(ctx) {
        try {
            const daytimeHistory = {
                type: ctx.data.type,
                unix: ctx.data.unix,
                employee_id: ctx.data.employee_id,
                author: ctx.data.author
            }

            const result = await client.day_time_history.update({
                where: {
                    id: +ctx.id,
                },
                data: daytimeHistory
            })
    
            return result
        } catch {
            return false;
        }
    }
    
    /**
     * Удаляет записи из таблицы `day_time_history`
     * 
     * @param {Object} ctx - объект, содержащий данные для удаления записи.
     * @param {Object} ctx.where - объект, содержащий критерии отбора записей для удаления.
     * @returns Возвращает true в случае успешного удаления,\
     *          иначе возвращает false.
     */
    async delete(ctx) {
        try {
            const where = ctx.where
            
            const result = await client.day_time_history.deleteMany({
                where: where
            });

            if(result) return true
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }
}

export default DaytimeHistoryModel