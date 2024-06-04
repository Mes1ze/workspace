import DaytimeHistoryService from "~/server/services/daytime-history-service"

const daytimeHistoryService = new DaytimeHistoryService()

export default defineEventHandler(async (event) => {
    try {
        const ctx = getQuery(event)
        const result = await daytimeHistoryService.getDaytimeHistories(ctx)
        setResponseStatus(event, result.status)
        return result
    } catch(e) {
        console.log(e)
    }
})