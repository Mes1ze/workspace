import TaskHistoryModel from "../models/task-history-model";
import helper from "./helper-service.js";

const taskHistoryModel = new TaskHistoryModel()

class TaskHistoryService {
    async create(data) {
        const taskHistory = {
            task_id    : data.task_id,
            employee_id: data.employee_id,
            date       : data.date,
            field      : data.field,
            old_value  : data.old_value,
            new_value  : data.new_value,
        }

        const result = await taskHistoryModel.create(taskHistory)

        if(result) return helper.resFormat(200, result)
        else return helper.resFormat(400, false)
    }

    async getHistoryForProject(params) {
        const project_id = params.project_id

        const where = {
            tasks: {
                is: {
                    project_id: parseInt(project_id)
                }
            }
        }

        const ctx = {
            select: params.select,
            where: where
        }

        const result = await taskHistoryModel.getAll(ctx)

        if(result) return helper.resFormat(200, result)
        else return helper.resFormat(404, false)
    }
}

export default TaskHistoryService