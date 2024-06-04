import helper from '~/server/services/helper-service'
import UserService from '~/server/services/user-service'

const userService = new UserService()

export default defineEventHandler(async (event) => {
    try {
        const id = event.context.auth?.id

        if (!id) {
            setResponseStatus(event, 401)
            return helper.resFormat(401)
        }

        const ctx = {
            id: id,
            returnHash: false,
        }

        const user = await userService.getUser(ctx)
        return user
    } catch (e) {
        console.log(e)
        return helper.resFormat(500)
    }
})