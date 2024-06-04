import { getCookie, deleteCookie } from 'h3'
import UserService from '~/server/services/user-service'

const userService = new UserService()

export default defineEventHandler(async (event) => {
    try {
        const refresh_token = getCookie(event, 'refresh_token')
        const result = await userService.logout({
            refresh_token: refresh_token
        })

        deleteCookie(event, 'refresh_token')
        deleteCookie(event, 'access_token')

        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e);
    }
})