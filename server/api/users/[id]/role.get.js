import helper from '~/server/services/helper-service'
import UserService from '~/server/services/user-service'

const userService = new UserService()

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')

        const ctx = {
            id: id,
            returnHash: false,
        }

        const role = await userService.getRole(ctx)
        return role
    } catch (e) {
        console.log(e)
        return helper.resFormat(500)
    }
})