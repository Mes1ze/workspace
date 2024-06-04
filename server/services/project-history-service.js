import ProjectHistoryModel from "../models/project-history-model";
import helper from "./helper-service.js";

const projectHistoryModel = new ProjectHistoryModel()

class ProjectHistoryService {
    async create(data) {
        const projectHistory = {
            project_id : data.project_id,
            employee_id: data.employee_id,
            date       : data.date,
            field      : data.field,
            old_value  : data.old_value,
            new_value  : data.new_value,
        }

        const result = await projectHistoryModel.create(projectHistory)

        if(result) return helper.resFormat(200, result)
        else return helper.resFormat(400, false)
    }

    async getHistoryForProject(params) {
        const project_id = params.project_id
        const where = {
            project_id: +project_id
        }

        const ctx = {
            select: params.select,
            where: where,
        }

        const result = await projectHistoryModel.getAll(ctx)

        if(result) return helper.resFormat(200, result)
        else return helper.resFormat(404, false)
    }
}

export default ProjectHistoryService