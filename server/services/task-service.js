import helper from "~/server/services/helper-service";
import TaskModel from "~/server/models/task-model";
import PerformerModel from "~/server/models/performer-model";
import TimeOfCompletionModel from "~/server/models/time-of-completion-model";

const taskModel = new TaskModel()
const performerModel = new PerformerModel()
const timeOfCompletionModel = new TimeOfCompletionModel()

class TaskService {
    //task
    async createTask(ctx) {
        try{
            const context = {
                body:{
                    name         : ctx.name,
                    release_time : +ctx.release_time || Date.now(),
                    time_on_task : +ctx.time_on_task || 0,
                    importance   : +ctx.importance || 0,
                    completion_id: +ctx.completion_id || 2,
                    director     : +ctx.director || 1,
                    deadline_time: +ctx.deadline_time || 0,
                    description  : ctx.description || "",
                    project_id   : +ctx.project_id || null,
                    order        : +ctx.order || 0
                },
                employee_id:ctx.employee_id
            }
            const result = await taskModel.create(context)
            if (result)
                return helper.resFormat(200, result)
            else{
                return helper.resFormat(404)
            }
        }catch(e){
            console.log(e)
            return helper.resFormat(500,e)
        } 
    }

    async getTask(id) {
        try {
            const taskContext = {
                where: {
                    id: +id
                }
            }
            const task = await taskModel.get(taskContext)
            const spentTime = await timeOfCompletionModel.getTime(id)
            const completion = await timeOfCompletionModel.getAll(id)
            if(task) {
                task.spent_time = spentTime
                task.time_of_Completion = completion

                return helper.resFormat(200, task)
            } else {
                return helper.resFormat(404)
            }
        }catch(e){
            console.log(e);
            return helper.resFormat(500, e)
        }
    }

    async getTasks(ctx) {
        try {
            const tasks = await taskModel.getAll(ctx);
            if(tasks) return helper.resFormat(200, tasks)
            else return helper.resFormat(404)
        } catch(e) {
            return helper.resFormat(500, e)
        }
    }

    async deleteTask(id) {
        try{
            const result = await taskModel.delete(id)
            if (result) return helper.resFormat(200, true)
            else return helper.resFormat(404, false)
        }catch(e){
            return helper.resFormat(500,e)
        }
    }

    async updateTask(ctx) {
        try{
            const id = ctx.id
            const userId = ctx.userId

            const data = {
                where: { id: id },
                data: {
                    release_time : +ctx.release_time || undefined,
                    time_on_task : +ctx.time_on_task || undefined,
                    importance   : +ctx.importance || undefined,
                    completion_id: +ctx.completion_id || undefined,
                    director     : +ctx.director || undefined,
                    status_id    : +ctx.status_id || undefined,
                    deadline_time: +ctx.deadline_time || undefined,
                    description  : ctx.description || undefined,
                    order        : +ctx.order || 0
                }
            }

            const result = await helper.updateWithArchive(taskModel, id, data, userId)
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(404, false)

        }catch(e){
            console.log(e);
            return helper.resFormat(500)
        }
    }

    async timePost(ctx){
        try{
            const context = {
                data: {
                    employee_id: +ctx.employee_id,
                    task_id: +ctx.task_id,
                    unix_time: +ctx.unix_time || Date.now(),
                    type: +ctx.type,
                    author: +ctx.author,
                }
            }
            const result = await timeOfCompletionModel.create(context)
            if (result) {
                return helper.resFormat(200, result)
            }
            else if (result!=false){
                return helper.resFormat(404)
            }else{
                return helper.resFormat(500)
            }
        }catch(e){
            console.log(e)
            return helper.resFormat(500)
        }
    }

    

    async getTime(ctx){
        try {
            const employee_id = ctx.employee_id

            const context = {
                employee_id : Number(ctx.employee_id),
            }

            const tasks = await taskModel.getTime(context);
            if (tasks)
                return helper.resFormat(200, tasks)
            else{
                return helper.resFormat(404)
            }
        }catch(e){
            return helper.resFormat(500,e)
        }
    }
}

export default TaskService