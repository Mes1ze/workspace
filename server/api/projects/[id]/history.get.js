import ProjectHistoryService from '~/server/services/project-history-service'

const projectHistoryService = new ProjectHistoryService()

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const ctx = {
            project_id: id
        }

        const result = await projectHistoryService.getHistoryForProject(ctx)
        
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})