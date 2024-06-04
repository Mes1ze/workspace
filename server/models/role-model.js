import helper from "~/server/services/helper-service"
import { PrismaClient } from "@prisma/client"

const client = new PrismaClient()

// стажёр: видит только некоторые проекты (свои) и свои задачи, другое не видит и пользователей тоже (только косвенно их данные)
// сотрудник: видит все проекты и свои задачи
// старший сотрудник: может иметь прикреплённых стажёров + всё как у сотрудника; может давать своим стажёрам задачи, их видеть; видеть их данные
// руководитель отдела: к нему прикрепляются стажёры и другие сотрудники, им даёт задачи и видит их
// проджект-менеджер: видит все проекты, все задачи, всех сотрудников (стажёров), прикреплять сотрудников может, даёт задачи; видит отчёты (конкретного вида)
// руководитель (директор, босс): он может всё, что может ПМ, + создавать новых пользователей, выдавать роли, прикреплять сотрудников; тоже видит отчёты (более расширенного вида, с расчётами)

// Должно быть отражено в базе
const Roles = {
    INTERN          : "intern",          // стажёр
    EMPLOYEE        : "employee",        // сотрудник
    SENIOR_EMPLOYEE : "senior_employee", // старший сотрудник
    MANAGER         : "manager",         // руководитель отдела
    PROJECT_MANAGER : "project_manager", // проджект-менеджер
    BOSS            : "boss",            // директор
}

const Permissions = {
    READ_OWN_PROJECTS: "read_own_projects",
    READ_OWN_TASKS: "read_own_tasks",
    READ_PROJECTS: "read_projects",
    READ_TASKS: "read_tasks",
    MANAGE_OWN_REPORTS: "manage_own_reports",
    MANAGE_INTERNS: "manage_interns",
    MANAGE_PROJECTS: "manage_projects",
    MANAGE_TASKS: "manage_tasks",
    MANAGE_REPORTS_SPECIFIC: "read_reports_specific",
    MANAGE_EMPLOYEES: "manage_employees",
    MANAGE_ROLES: "manage_roles",
    MANAGE_REPORTS_FULL: "read_reports_full",
}

const permissionsByRole = new Map([
    [Roles.INTERN, [
        Permissions.READ_OWN_PROJECTS,
        Permissions.READ_OWN_TASKS
    ]],
    [Roles.EMPLOYEE, [
        Permissions.READ_PROJECTS,
        Permissions.READ_OWN_TASKS,
        Permissions.MANAGE_OWN_REPORTS
    ]],
    [Roles.SENIOR_EMPLOYEE, [
        Permissions.READ_PROJECTS,
        Permissions.READ_OWN_TASKS,
        Permissions.MANAGE_OWN_REPORTS,
        Permissions.MANAGE_INTERNS,
    ]],
    [Roles.MANAGER, [
        Permissions.READ_PROJECTS,
        Permissions.READ_TASKS,
        Permissions.MANAGE_OWN_REPORTS,
        Permissions.MANAGE_TASKS,
    ]],
    [Roles.PROJECT_MANAGER, [
        Permissions.READ_PROJECTS,
        Permissions.READ_TASKS,
        Permissions.MANAGE_REPORTS_SPECIFIC,
        Permissions.MANAGE_TASKS,
    ]],
    [Roles.BOSS, [
        Permissions.READ_PROJECTS,
        Permissions.READ_TASKS,
        Permissions.MANAGE_REPORTS_FULL,
        Permissions.MANAGE_TASKS,
        Permissions.MANAGE_EMPLOYEES,
        Permissions.MANAGE_ROLES,
    ]]
])

function roleExists(name) {
    const role = Object.values(Roles).find(key => key == name)
    if(role) return true
    else return false
}

class RoleModel {
    async get(ctx) {
        try {
            const select = ctx.select ?? await helper.constructDefaultSelect(client.roles, [])
            const where = ctx.where
            
            const result = await client.roles.findUnique({
                select: select,
                where: where
            });

            if(result) return result
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }

    async getAll(ctx) {
        try {
            const select = ctx.select ?? await helper.constructDefaultSelect(client.roles, [])
            const where = ctx.where
            
            const result = await client.roles.findMany({
                select: select,
                where: where
            });

            if(result) return result
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }

    async getPermissions(user_id) {
        try {
            const role = (await client.employee.findUnique({
                select: {
                    roles: {
                        select: {
                            name: true
                        }
                    }
                },
                where: {
                    id: +user_id
                }
            }))?.roles?.name

            //console.log(roleExists(role))
            if(role && roleExists(role)) {
                const permissions = permissionsByRole.get(role)
                
                return permissions
            }
            else return []
        } catch(e) {
            console.log(e)
            return []
        }
    }
}

export default RoleModel