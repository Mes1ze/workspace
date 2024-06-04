import SubordinateModel from '~/server/models/subordinate-model'
import helper from '~/server/services/helper-service'

const subordinateModel = new SubordinateModel()

class SubordinateService {
    async createSubordinate(ctx) {
        try {
            const data = {
                leader_id: ctx.leader_id,
                subordinate_id: ctx.subordinate_id,
            }

            const result = await subordinateModel.create(data)
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(400)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async getSubordinates(ctx) {
        try {
            const select = ctx.select
            const where  = ctx.where
            const params = ctx.params

            const data = {
                select: select,
                where: where,
                params: params
            }

            const result = await subordinateModel.getAll(data)
            
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(404, false)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async getSubordinate(ctx) {
        try {
            const select = ctx.select
            const id = ctx.id

            const data = {
                select: select,
                where: { id: +id }
            }

            const result = await subordinateModel.get(data)
            
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(404, false)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async deleteSubordinate(id) {
        try {
            const result = await subordinateModel.delete(id)
            
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(404, false)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }
}

export default SubordinateService