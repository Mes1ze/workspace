import { getCookie } from 'h3'
import UserService from '~/server/services/user-service'

const userService = new UserService()

export default defineEventHandler(async (event) => {
    const refresh_token = getCookie(event, 'refresh_token')
    const result = await userService.refresh({
        refresh_token: refresh_token
    })
    setResponseStatus(event, result.status)

    if (result.success) {
        console.log(result)
        setCookie(event, 'refresh_token', result.data.refresh_token, {maxAge: 30 * 24 * 60 * 60, httpOnly: true, sameSite: false})
        setCookie(event, 'access_token', result.data.access_token, {maxAge: 30 * 60, httpOnly: true, sameSite: false})

        //delete result.data
    }

    return result
})