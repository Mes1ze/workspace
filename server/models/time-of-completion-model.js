import { PrismaClient } from "@prisma/client"
import helper from "../services/helper-service"

const client = new PrismaClient()

class TimeOfCompletionModel {
    async create(ctx) {
        try{
            const result = await client.time_of_completion.create({
                data: ctx.data
            })
            return result
        }catch(e){
            console.log(e);
            return false;
        }
    }

    async get(ctx) {
        try{
            const time = await client.time_of_completion.findUnique({
                where: ctx.where,
            })
            return time;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    async getAll(id) {
        try {
            const flags = await client.time_of_completion.findMany({
                select: {
                    task_id: true,
                    unix_time: true,
                    employee_id: true,
                    time_completions_types: true
                },
                where: {
                    task_id: +id
                },
                orderBy: {
                    unix_time: "asc"
                }
            })

            // for(let i = 1; i < flags.length; i++) {
            //     flags[i].previous_unix_time = flags[i - 1].unix_time
            //     flags[i].time_period = (flags[i].unix_time - flags[i - 1].unix_time)
            // }
    
            if(flags) return flags
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }

    async getTime(id) {
        const flags = await client.time_of_completion.findMany({
            select: {
                task_id: true,
                unix_time: true,
                employee_id: true,
                time_completions_types: true
            },
            where: {
                task_id: +id
            },
            orderBy: {
                unix_time: "asc"
            }
        })

        // Имеет смысл только при фильтрации по конкретной задаче; иначе бессмысленно.
        for(let i = 1; i < flags.length; i++) flags[i].time_period =  (flags[i].unix_time - flags[i - 1].unix_time)
        const time = flags.map(flag => flag.time_period || 0).reduce((previous, current) => previous += current, 0)
        
        return time
    }
}

export default TimeOfCompletionModel