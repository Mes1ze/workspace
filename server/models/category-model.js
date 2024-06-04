import { PrismaClient } from "@prisma/client"
import helper from "~/server/services/helper-service"

const client = new PrismaClient()

class CategoryModel {
    async create(ctx){
        try {
            const result = await client.task_category.create({
                data:ctx.data
            })
            return result
        } catch(e) {
            console.log(e);
            return false;
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
    
    async delete(id){
        try {
            const result = await client.task_category.deleteMany({
                where: {
                    id: +id
                }
            })

            return result ? true : false
        } catch(e) {
            console.log(e);
            return false;
        }
    }
}

export default CategoryModel