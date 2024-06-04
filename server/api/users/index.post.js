import UserService from '~/server/services/user-service'

const userService = new UserService()

export default defineEventHandler(async (event) => {
    try {
        const ctx = await readBody(event)
        const result = await userService.createUser(ctx)
        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})