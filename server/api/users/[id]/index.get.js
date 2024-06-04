import UserService from '~/server/services/user-service'
import helper from '~/server/services/helper-service'

const userService = new UserService()

export default defineEventHandler(async (event) => {
    try {
        const returnHash = getQuery(event)
        const id = getRouterParam(event, 'id')
        
        if (!event.context.auth) {
            setResponseStatus(event, 401)
            return helper.resFormat(401)
        }
        
        const ctx = {
            id: id,
            returnHash: returnHash
        }

        const result = await userService.getUser(ctx)
        return result
    } catch (e) {
        console.log(e)
    }
})