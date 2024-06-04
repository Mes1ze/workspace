import projectService from '~/server/services/project-service'

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const ctx = {
            where: {
                id: +id
            }
        }

        const result = await projectService.getProject(ctx)
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})