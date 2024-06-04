import RoleModel from "~/server/models/role-model";
import helper from "~/server/services/helper-service";

const roleModel = new RoleModel()

class RoleService {
    async createRole(ctx) {
        try {
            const data = {
                name: ctx.name
            }
    
            const result = await roleModel.create(data)
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(400)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async getPermissions(user_id) {
        try {
            const result = await roleModel.getPermissions(user_id)

            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(404, [])
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async getRole(ctx) {
        try {
            const data = {
                where: {
                    id:  +ctx.id || undefined
                }
            }

            const result = await commentModel.get(data)
            
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(404, false)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async getRoles(ctx) {
        try {
            const result = await roleModel.getAll(ctx)
            
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(404, false)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async deleteRole(ctx) {
        try {
            const data = {
                where: {
                    id: +ctx.id,
                }
            }

            const result = await roleModel.delete(data)

            if (result) return helper.resFormat(200, true)
            else return helper.resFormat(404)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async updateRole(ctx) {
        try {
            const data = {
                id: +ctx.id,
                data: {
                    name: ctx.name
                }
            }
            const result = await roleModel.update(data)
            if (result) {
                return helper.resFormat(200, result)
            } else {
                return helper.resFormat(404)
            }
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }
}

export default RoleService
