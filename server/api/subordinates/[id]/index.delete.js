import SubordinateService from '~/server/services/subordinate-service'

const subordinateService = new SubordinateService()

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const result = await subordinateService.deleteSubordinate(id)
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})