import CommentModel from "~/server/models/comment-model.js";
import helper from "~/server/services/helper-service";

const commentModel = new CommentModel()

class CommentService {
    async createComment(ctx) {
        try {
            const userId = +ctx.employee_id
            if(!userId) return helper.resFormat(401)
    
            const data = {
                task_id: +ctx.task_id,
                employee_id: +ctx.employee_id,
                text: ctx.text,
            }
    
            const result = await commentModel.create(data)
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(400)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async getComment(ctx) {
        try {
            const result = await commentModel.get(ctx)
            
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(404, false)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async getComments(ctx) {
        try {
            const result = await commentModel.getAll(ctx)
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(404, false)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async deleteComment(id) {
        try {
            const result = await commentModel.delete(id)
            if (result) return helper.resFormat(200, true)
            else return helper.resFormat(404)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async updateComment(ctx) {
        try {
            const result = await commentModel.update(ctx)
            if (result) {
                return helper.resFormat(200, result)
            } else {
                return helper.resFormat(404)
            }
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }
}

export default CommentService
