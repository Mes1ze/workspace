import ProjectModel from "../models/project-model";
import TaskModel from "~/server/models/task-model"
import helper from "../services/helper-service.js";

const projectModel = new ProjectModel()
const taskModel = new TaskModel()

class ProjectService {
    async create(data) {
        if (!data?.name) {
            return helper.resFormat(400, "Не указано название проекта");
        }

        try {
            const res = await projectModel.create(data)

            return helper.resFormat(201, {
                message: `Проект ${data.name} успешно создан`,
                result: res,
            });
        } catch (error) {
            console.log(error);
            return helper.resFormat(
                500,
                "Ошибка при создании проекта. Повторите попытку позже."
            );
        }
    }

    async getProjects(ctx) {
        try {
            const params = {
                is_archive: ctx.is_archive,
                deadline: ctx.deadline,
                customer: ctx.customer,
                page: ctx.page,
                count: ctx.count,
            }

            //? Это код фильтрации по id колонки, работает но излишен
            if(ctx.column) params.where.project_columns = {
                some: {
                    id: +params.column
                }
            }

            const projects = await projectModel.getAll(params)
            return helper.resFormat(200, projects)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async getProject(params) {
        try {
            const ctx = {
                select: params.select,
                where: params.where,
            }

            const project = await projectModel.get(ctx)

            if (project) return helper.resFormat(200, project)
            else return helper.resFormat(404, "Проект не найден")
        } catch (e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async getTasksForProject(params) {
        try {
            const ctx = {
                select: params.select,
                where: {
                    project_id: params.project_id
                }
            }
            const tasks = await taskModel.getAll(ctx)

            if(tasks) return helper.resFormat(200, tasks)
            else return helper.resFormat(404, 'Задачи не найдены')
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async update(params) {
        try {
            const id = parseInt(params.id)
            const userId = params.userId

            const data = {
                where: { id: id },
                data: {
                    name          : params.name,
                    description   : params.description,
                    deadline      : params.deadline,
                    responsible_id: params.responsible_id,
                    customer      : params.customer,
                    is_archive    : params.is_archive,
                    stage_id      : params.stage_id,
                }
            }

            const result = await helper.updateWithArchive(projectModel, id, data, userId)
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(400, false)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }
}

export default new ProjectService()
