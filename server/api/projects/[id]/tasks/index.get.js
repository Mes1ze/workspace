import TaskService from '~/server/services/task-service'

const taskService = new TaskService()

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const ctx = {
            project_id: id
        }

        const tasks = await taskService.getTasks(ctx)
        setResponseStatus(event, tasks.status)
        return tasks;
    } catch (e) {
        console.log(e)
    }
})