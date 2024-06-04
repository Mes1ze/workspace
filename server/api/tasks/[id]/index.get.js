//todo получить профиль задачи, когда открываешь её
import TaskService from '~/server/services/task-service'

const taskService = new TaskService()

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const result = await taskService.getTask(id)
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})