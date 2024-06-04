import DaytimeHistoryService from "~/server/services/daytime-history-service"
import helper from "~/server/services/helper-service"

const daytimeHistoryService = new DaytimeHistoryService()

export default defineEventHandler(async (event) => {
    try {
        let ctx = {}

        ctx.user = event.context.auth
        ctx.data = await readBody(event)
        
        ctx.data.employee_id = getRouterParam(event, "id")

        if(ctx.data.employee_id != ctx.user.id && !(ctx.data.comment ?? "").trim()) {
            setResponseStatus(event, 400)   
            return helper.resFormat(400, "При закрытии смены за другого сотрудника вы обязаны указать комментарий.")
        }
        
        const result = await daytimeHistoryService.endDaytime(ctx)
        
        setResponseStatus(event, result.status)
        return result
    } catch(e) {
        console.log(e)
    }
})