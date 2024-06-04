import { PrismaClient } from "@prisma/client"
import helper from "~/server/services/helper-service"

const client = new PrismaClient()

/**
 * Модель таблицы `comments` базы данных.
 * 
 */
class CommentModel {
    /**
     * Создаёт новую запись в таблице `comments`.
     *
     * @param {Object} data - объект, содержащий данные для записи в таблицу.
     * @param {string|number} data.task_id - ID задачи, к которой написан комментарий.
     * @param {string|number} data.employee_id - ID пользователя, написавшего комментарий.
     * @param {string} data.text - Текст комментария. Не может быть пустым.
     * 
     * @returns Возвращает созданную запись, если её удалось создать,\
     *          иначе возвращает false
     */
    async create(data) {
        try {
            if(!data.text.trim()) throw new Error(`Нельзя оставить пустой комментарий.`)

            const comment = {
                data: {
                    task_id: +data.task_id,
                    employee_id: +data.employee_id,
                    text: data.text
                }
            }

            const result = await client.comments.create(comment)
            if(result) return result
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }

    /**
     * Получает уникальную запись из таблицы `comments`.
     * 
     * @param {Object} ctx - объект, содержащий данные для формирования запроса
     * @param {Object} ctx.select - объект, содержащий поля записи, которые будут возвращены;\
     *                              если отсутствует, будут возвращены все поля.
     * @param {Object} ctx.where - объект, содержащий критерии отбора записи;\
     *                             должен присутствовать, обычно имеет поле `id`: `number`
     * @returns Возвращает найденную запись, если она существует,\
     *          иначе возвращает false.
     */
    async get(ctx) {
        try {
            const select = ctx.select ?? await helper.constructDefaultSelect(client.comments, [
                //"tasks",
                "employee"
            ])
            
            const result = await client.comments.findUnique({
                select: select,
                where: { 
                    id: +ctx.id || undefined
                }
            });

            try { delete result.employee.password_hash } catch(e) {}

            if(result) return result
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }

    /**
     * Получает множество записей из таблицы `comments`.
     * 
     * @param {Object} ctx - объект, содержащий данные для формирования запроса.
     * @param {Object} ctx.select - объект, содержащий поля записей, которые будут возвращены;\
     *                              если отсутствует, будут возвращены все поля.
     * @param {Object} ctx.where - объект, содержащий критерии отбора записей;\
     *                             может отсутствовать, тогда будут выбраны все записи.
     * @param {Object} ctx.params - объект, содержащий данные о пагинации\
     *                              может отсутствовать, тогда пагинация не будет осуществляться.
     * @param {string | number} ctx.params.page - номер текущей страницы.
     * @param {string | number} ctx.params.count - количество записей на страницах.
     * @returns Возвращает найденные записи, если они существуют,\
     *          иначе возвращает false.
     */
    async getAll(ctx) {
        try {
            const select = ctx.select ?? await helper.constructDefaultSelect(client.comments, [
                //"tasks",
                "employee"
            ])
            const where = {
                task_id: +ctx.id
            }
            const pagination = {
                page: ctx.page,
                count: ctx.count
            }
            
            const result = pagination
                ? await helper.getAllPaginated(client.comments, select, where, pagination)
                : await client.comments.findMany({
                    select: select,
                    where: where
                });
            

            (pagination ? result.result : result).forEach(comment => {
                delete comment.employee.password_hash
            })

            if(result) return result
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }

    /**
     * Обновляет запись в таблице `comments`.
     * 
     * @param {Object} ctx - объект, содержащий данные для обновления записи.
     * @param {Object} ctx.data - объект, содержащий новые данные для записи в таблицу.
     * @param {number|string} ctx.id - ID обновляемой записи.
     * @returns Возвращает обновлённую запись в случае успешного обновления,\
     *          иначе возвращает false.
     */
    async update(ctx) {
        try {
            const comment = {
                task_id: ctx.task_id,
                author: ctx.author,
                text: ctx.text,
            }

            const result = await client.comments.update({
                where: {
                    id: +ctx.id,
                },
                data: comment
            })
    
            return result
        } catch {
            return false;
        }
    }

    /**
     * Удаляет записи из таблицы `comments`
     * 
     * @param {Object} ctx - объект, содержащий данные для удаления записи.
     * @param {Object} ctx.where - объект, содержащий критерии отбора записей для удаления.
     * @returns Возвращает true в случае успешного удаления,\
     *          иначе возвращает false.
     */
    async delete(id) {
        try {
            const result = await client.comments.deleteMany({
                where: {
                    id: +id
                }
            })
            
            if(result && result.count) return true
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }
}

export default CommentModel
