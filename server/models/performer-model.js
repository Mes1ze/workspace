import { PrismaClient } from "@prisma/client"

const client = new PrismaClient()

class PerformerModel {
    async create(ctx) {
        try {
            const performer = {
                data: {
                    task_id: +ctx.task_id,
                    executor_id: +ctx.executor_id,
                    director_id: +ctx.director_id
                }
            }

            const result = await client.task_performers.create(performer)
            return result
        } catch(e) {
            console.log(e)
            return false
        }
    }

    async delete(id) {
        try{
            const result = await client.task_performers.delete({
                where: {
                    id: +id
                }
            })
            
            if(result && result.count) return true
            else return false
        }catch{
            return false;
        }
    }
}

export default PerformerModel
