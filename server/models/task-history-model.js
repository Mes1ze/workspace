import { PrismaClient } from "@prisma/client"
import helper from "~/server/services/helper-service"

const client = new PrismaClient()

class TaskHistoryModel {
    async create(data) {

        const result = await client.tasks_history.create({data: data})

        return result
    }

    async getAll(ctx) {
        try {
            const select = ctx.select ?? await helper.constructDefaultSelect(client.tasks_history, [
                "employee",
            ])
            const where = ctx.where
            const params = ctx.params
            
            const result = params
                ? await helper.getAllPaginated(client.tasks_history, select, where, params)
                : await client.tasks_history.findMany({
                    select: select,
                    where: where
                });
            

            (params ? result.result : result).forEach(history => {
                try { delete history.employee.password_hash } catch(e) {}
            }) 

            if(result) return result
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }
}

export default TaskHistoryModel