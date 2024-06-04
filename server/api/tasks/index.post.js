import TaskService from '~/server/services/task-service'

const taskService = new TaskService()

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const id = event.context.auth?.id

        const ctx = {
            employee_id:id,
            ...body
        }

        const result = await taskService.createTask(ctx)
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})