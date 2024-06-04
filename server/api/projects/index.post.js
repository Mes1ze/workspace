import projectService from "~/server/services/project-service";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const result = await projectService.create(body)

        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})