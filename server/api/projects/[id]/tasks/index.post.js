import TaskService from '~/server/services/task-service'

const taskService = new TaskService()

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const project_id = getRouterParam(event, "id")
        const id = event.context.auth?.id

        const ctx = {
            ...body,
            project_id: project_id,
            employee_id:id,
        }

        const result = await taskService.createTask(ctx)

        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})