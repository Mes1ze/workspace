import PerformerModel from "../models/performer-model"
import helper from "../services/helper-service.js"

const performerModel = new PerformerModel()

class PerformerService {
    async createPerformer(ctx) {
        try{
            const result = await performerModel.create(ctx)
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(404)
        }catch(e){
            console.log(e)
        }
    }

    async deletePerformer(id) {
        try{
            const result = await performerModel.delete(id)
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(404)
        }catch(e){
            console.log(e)
        }
    }
}

export default PerformerService
