import TaskService from '~/server/services/task-service'

const taskService = new TaskService()

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const id = getRouterParam(event, 'id')

        const userId = +event.context.auth?.id || 0

        const params = {
            ...body,
            userId: userId,
            id: +id,
        }

        const result = await taskService.updateTask(params)
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})