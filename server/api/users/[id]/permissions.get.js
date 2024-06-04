import helper from '~/server/services/helper-service'
import RoleService from '~/server/services/role-service'

const roleService = new RoleService()

export default defineEventHandler(async (event) => {
    try {
        const id = +getRouterParam(event, 'id')
        const role = await roleService.getPermissions(id)
        return role
    } catch (e) {
        console.log(e)
        return helper.resFormat(500)
    }
})