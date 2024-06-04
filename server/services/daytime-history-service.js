import DaytimeHistoryModel from '~/server/models/daytime-history-model'
import helper from '~/server/services/helper-service'

const daytimeHistoryModel = new DaytimeHistoryModel()

class DaytimeHistoryService {
    async createDaytimeHistory(ctx) {
        try {
            const user = ctx.user
            if(!user) return helper.resFormat(401)

            /** @todo TODO: проверка на права, если запись для другого пользователя */

            const data = {
                type        : ctx.data.type,
                unix        : ctx.data.unix,
                employee_id : ctx.data.employee_id,
                author      : ctx.user.id,
                comment     : ctx.data.comment
            }

            const result = await daytimeHistoryModel.create(data)
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(400)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async getDaytimeHistories(ctx) {
        try {
            const result = await daytimeHistoryModel.getAll(ctx)
            
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(404, false)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async getDaytimeHistory(ctx) {
        try {

            const data = {
                select: ctx.select,
                where: { id: +ctx.id }
            }

            const result = await daytimeHistoryModel.get(data)
            
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(404, false)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async startDaytime(ctx) {
        try {
            ctx.data.type = "start"

            return await this.createDaytimeHistory(ctx)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async endDaytime(ctx) {
        try {
            ctx.data.type = "end"

            return await this.createDaytimeHistory(ctx)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }
}

export default DaytimeHistoryService