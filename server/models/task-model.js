import { client } from "~/server/extensions/tasks-extension"
import helper from "../services/helper-service"

class TaskModel {
    async create(ctx) {
        try{
            const task = await client.tasks.create({data:ctx.body})
            const performer = await client.task_performers.create({data:{
                task_id:task.id,
                executor_id:ctx.employee_id,
                director_id:task.director
            }})
            console.log(performer);
            const select = ctx.select ?? await helper.constructDefaultSelect(client.tasks, [
                "task_category",
                "task_performers",
                "completion_scores",
                "employee",
                "project_columns",
            ])

            const where = {
                id:task.id
            }

            const add = await client.tasks.findUnique({
                select: select,
                where: where
            });

            if(!task) return false
            else return {
                ...task,
                ...add
            }
        } catch(e) {
            console.log(e)
            return false;
        }
    }

    async get(ctx) {
        try {
            const select = ctx.select ?? await helper.constructDefaultSelect(client.tasks, [
                "task_category",
                "task_performers",
                "completion_scores",
                "employee",
                "project_columns",
            ])
            const where = ctx.where
            
            const result = await client.tasks.findUnique({
                select: select,
                where: where
            });

            try { delete result.task_performers.employee_task_performers_director_idToemployee.password_hash } catch(e) {}
            try { delete result.task_performers.employee_task_performers_executor_idToemployee.password_hash } catch(e) {}
            result.projects = await client.projects.findFirst({ where: {
                id: result.project_columns?.project_id
            }})

            if(result) return result
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }

    async delete(id) {
        try {
            const result = await client.tasks.delete({
                where: {
                    id:+id
                }
            })

            if(result) return result
            else return false
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async update(ctx) {
        try{
            console.log(ctx.where);
            console.log(ctx.data)
            const check = await client.tasks.findFirst({where:ctx.where})
            if (!check){
                return check;
            }
            const result = await client.tasks.update({
                where: ctx.where,
                data: ctx.data
            })
            return result
        }catch(e){
            console.log(e);
            return false;
        }
    }

    async getAll(ctx) {
        try {
            const select = ctx.select ?? await helper.constructDefaultSelect(client.tasks, [
                "task_category",
                "task_performers",
                "completion_scores",
                "employee",
                "project_columns",
                "comments"
            ])
            const where = {
                task_performers: {
                    some: {
                        employee_task_performers_executor_idToemployee: {
                            id: +ctx.employee_id || undefined
                        }
                    }
                },
                completion_id: +ctx.completion_id || undefined,
                project_columns: {
                    projects: {
                        id: +ctx.project_id || undefined
                    }
                },
            }
            const pagination = (ctx.page && ctx.count) 
                ? {
                    page: ctx.page,
                    count: ctx.count
                }
                : undefined
            
            let result = pagination
                ? await helper.getAllPaginated(client.tasks, select, where, pagination)
                : await client.tasks.findMany({
                    select: select,
                    where: where
                })

            for(const task of (pagination ? result.result : result)) {
                try { delete task.task_performers.employee_task_performers_director_idToemployee.password_hash } catch(e) {}
                try { delete task.task_performers.employee_task_performers_executor_idToemployee.password_hash } catch(e) {}
                try { delete task.employee.password_hash } catch(e) {}
                task.projects = await client.projects.findFirst({ where: {
                    id: task.project_columns.project_id
                }})
            }

            //console.log(result)

            (pagination ? result.result : result).sort((a, b) => b.importance - a.importance)
            if(pagination) result.result = result.result.filter(entry => ctx.completion_name 
                ? entry.completion_scores.name == ctx.completion_name
                : entry.completion_scores.name != "completed")
            else result = result.filter(entry => ctx.completion_name 
                ? entry.completion_scores.name == ctx.completion_name
                : entry.completion_scores.name != "completed")

            if(result) return result
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }
}

export default TaskModel
