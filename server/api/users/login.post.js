import { setCookie } from 'h3'
import UserService from '~/server/services/user-service'

const userService = new UserService()

export default defineEventHandler(async (event) => {
    try {
        const ctx = await readBody(event)
        const result = await userService.login(ctx)

        if (result.success) {
            setCookie(event, 'refresh_token', result.data.tokens.refresh_token, {maxAge: 30 * 24 * 60 * 60, httpOnly: true, sameSite: false})
            setCookie(event, 'access_token', result.data.tokens.access_token, {maxAge: 30 * 60, httpOnly: true, sameSite: false})
        }

        setResponseStatus(event, result.status)
        return result
    } catch (e) {
        console.log(e)
    }
})