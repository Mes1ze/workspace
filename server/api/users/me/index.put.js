import UserService from '~/server/services/user-service'
import helper from '~/server/services/helper-service'

const userService = new UserService()

export default defineEventHandler(async (event) => {
    try {
        const id = event.context.auth?.id

        if (!id) {
            setResponseStatus(event, 401)
            return helper.resFormat(401)
        }

        const body = await readBody(event)

        const ctx = {
            ...body,
            id: id,
            returnHash: false
        }
        
        //console.log(ctx)

        const result = await userService.updateUser(ctx)
        const user = await userService.getUser(ctx);
        result.data = user.data
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})