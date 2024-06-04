import TaskService from '~/server/services/task-service'

const taskService = new TaskService()

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        const id = event.context.auth?.id
        const ctx = {
            ...query,
            employee_id:id
        }
        const result = await taskService.getTasks(ctx)
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})