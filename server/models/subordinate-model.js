import { PrismaClient } from "@prisma/client"

const client = new PrismaClient()

class SubordinateModel {
    async create(ctx) {
        try {
            const subordinate = {
                data: {
                    leader_id: +ctx.leader_id,
                    subordinate_id: +ctx.subordinate_id,
                }
            }

            const result = await client.subordinates.create(subordinate)
            return result
        } catch(e) {
            console.log(e)
            return false
        }
    }

    async getAll(ctx) {
        try {
            const result = await client.task_category.findMany({
                select: ctx.select,
                where: ctx.where
            });

            return result || false
        } catch(e) {
            console.log(e)
            return false
        }
    }

    async delete(id) {
        try{
            const result = await client.subordinates.deleteMany({
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

export default SubordinateModel