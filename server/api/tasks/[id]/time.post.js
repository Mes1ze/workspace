//todo Назначить задачу
import TaskService from '~/server/services/task-service'

const taskService = new TaskService()

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const id = getRouterParam(event, 'id')

        const ctx = {
            ...body,
            task_id: id,
        }
        const result = await taskService.timePost(ctx)
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})