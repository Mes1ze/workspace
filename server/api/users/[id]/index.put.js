import UserService from '~/server/services/user-service'
import helper from '~/server/services/helper-service'

const userService = new UserService()

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const id = getRouterParam(event, 'id')

        if (!event.context.auth) {
            setResponseStatus(event, 401)
            return helper.resFormat(401)
        }

        const ctx = {
            ...body,
            id: id
        } 

        const result = await userService.updateUser(ctx)
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})