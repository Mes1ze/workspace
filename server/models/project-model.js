import { client } from "~/server/extensions/projects-extension"
import helper from "~/server/services/helper-service";

class ProjectModel {
    async create(ctx) {
        const result = await client.projects.create({
            data: {
                name           : ctx.name,
                description    : ctx.description,
                deadline       : ctx.deadline,
                responsible_id : +ctx.responsible_id,
                stage_id       : +ctx.stage_id,
                customer       : ctx.customer,
                is_archive     : ctx.is_archive,
            }
        })
        return result
    }

    async get(ctx) {
        try {
            const select = ctx.select ?? await helper.constructDefaultSelect(client.projects, [
                "employee",
                "project_stages"
            ])
            const where = ctx.where
            
            const result = await client.projects.findUnique({
                select: select,
                where: where
            });

            try { delete result.employee.password_hash } catch(e) { }

            if(result) return result
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }

    async getAll(ctx) {
        try {
            
            const where = {
                is_archive: ctx.is_archive,
                deadline: ctx.deadline,
                customer: ctx.customer  
            } 
            const pagination = ctx.is_archive ? {
                page: +ctx.page,
                count: +ctx.count
            } : undefined

            let select = ctx.select ?? {
                id:         true,
                customer:   true,
                deadline:   true,
                is_archive: true,
                name:       true,
                project_columns: {
                    orderBy: {
                        order_number: 'asc',
                    },
                    include: {
                        tasks: true,
                    },
                },
                employee: {
                    select: {
                        firstname: true,
                        fathername: true,
                    }
                },
                project_stages_projects_stage_idToproject_stages: {
                    select: {
                        name: true,
                    }
                }
            }
            const result = pagination
                ? await helper.getAllPaginated(client.projects, select, where, pagination)
                : await client.projects.findMany({
                    select: select,
                    where: where
                });

                // if(pagination != undefined) {

                //     result.forEach(project => {
                //         try { 
                //             const stage = project.project_stages_projects_stage_idToproject_stages?.name;
                //             project.stage = stage;
                //             delete project.project_stages_projects_stage_idToproject_stages;
                //         } catch(e) {}
                //     }) 
                // }

            (pagination ? result.result : result).sort((a, b) => (+a.deadline) - (+b.deadline))


            if(result) return result
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }

    async delete(where) {
        const result = await client.projects.delete({
            where: where
        })

        return result
    }

    async update(project) {
        const result = await client.projects.update({
            where: project.where,
            data: project.data,
            include: {
                employee: true,
                project_stages: true
            }
        })
        try { delete result.employee.password_hash }
        catch { console.log('Ошибка при очистке поля хеша пароля.') }
        return result
    }
}

export default ProjectModel