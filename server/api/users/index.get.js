import UserService from '~/server/services/user-service'

const userService = new UserService()

export default defineEventHandler(async (event) => {
    try {
        const ctx = getQuery(event)
        const users = await userService.getUsers(ctx)
        setResponseStatus(event, users.status)
        return users
    } catch (e) {
        console.log(e)
    }
})