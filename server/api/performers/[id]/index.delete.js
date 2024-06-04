import PerformerService from '~/server/services/performer-service'

const performerService = new PerformerService()

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const result = await performerService.deletePerformer(id)
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})