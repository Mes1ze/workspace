import DaytimeHistoryService from "~/server/services/daytime-history-service"

const daytimeHistoryService = new DaytimeHistoryService()

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const ctx = {
            id: id
        }
        
        const result = await daytimeHistoryService.getDaytimeHistory(ctx)
        
        setResponseStatus(event, result.status)
        return result
    } catch(e) {
        console.log(e)
    }
})