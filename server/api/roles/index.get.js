import RoleService from '~/server/services/role-service'

const roleService = new RoleService()

export default defineEventHandler(async (event) => {
    try {
        const result = await roleService.getRoles({})
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})