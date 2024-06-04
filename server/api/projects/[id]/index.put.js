import projectService from "~/server/services/project-service";

export default defineEventHandler(async (event) => {
    try {
        const userId = +event.context.auth?.id || 0

        const body = await readBody(event)
        const id = getRouterParam(event, 'id')

        const ctx = {
            ...body,
            id: id,
            userId: userId,
        }
        
        const result = await projectService.update(ctx)
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e);
    }
})