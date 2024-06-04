import projectService from '~/server/services/project-service'
export default defineEventHandler(async (event) => {
    try {
        const params = getQuery(event)
        const projects = await projectService.getProjects(params)
        setResponseStatus(event, projects.status)
        return projects
    } catch (e) {
        console.log(e)
    }
})