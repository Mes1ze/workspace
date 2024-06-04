import { PrismaClient } from "@prisma/client"
import helper from "~/server/services/helper-service"

const client = new PrismaClient()

class ProjectHistoryModel {
    async create(data) {
        const result = await client.project_history.create({data: data})
        
        return result
    }

    async getAll(ctx) {
        try {
            const select = ctx.select ?? await helper.constructDefaultSelect(client.project_history, [
                "employee",
            ])
            const where = ctx.where
            const params = ctx.params
            
            const result = params
                ? await helper.getAllPaginated(client.project_history, select, where, params)
                : await client.project_history.findMany({
                    select: select,
                    where: where
                });
            

            (params ? result.result : result).forEach(history => {
                delete history.employee.password_hash
            }) 

            if(result) return result
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }
}

export default ProjectHistoryModel