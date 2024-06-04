import PerformerService from '~/server/services/performer-service'

const performerService = new PerformerService()

export default defineEventHandler(async (event) => {
    try {
        const ctx = await readBody(event)
        const id = getRouterParam(event, 'id')
        ctx.id = id
        const result = await performerService.createPerformer(ctx)
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})