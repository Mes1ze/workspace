import TaskHistoryService from '~/server/services/task-history-service'

const taskHistoryService = new TaskHistoryService()

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const ctx = {
            project_id: id
        }

        const result = await taskHistoryService.getHistoryForProject(ctx)
        setResponseStatus(event, result.status)
        return result
    } catch(e) {
        console.log(e)
    }
})