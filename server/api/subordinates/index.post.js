import SubordinateService from '~/server/services/subordinate-service'

const subordinateService = new SubordinateService()

export default defineEventHandler(async (event) => {
    try {
        const ctx = await readBody(event)
        const result = await subordinateService.createSubordinate(ctx)
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})