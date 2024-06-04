import tokenService from "~/server/services/token-service";
import { getCookie } from 'h3'

/**
 * @param {String} cookies 
 * @returns {bool}
 */
async function authenticate(cookies) {
    const access_token = cookies.split('; ').find(s => s.startsWith("access_token")).substring("access_token".length + 1)
    console.log(access_token)

    console.log("on access_token")
    if (!access_token) return false

    const userData = await tokenService.validateAccessToken(access_token)
    
    console.log("on userData")
    if(!userData) return false

    console.log("checks passed")
    return true
}

export default defineEventHandler(async (event) => {
    event.context.auth = false;

    const access_token  = getCookie(event, 'access_token');

    if (!access_token) {
        return;
    }

    const userData = await tokenService.validateAccessToken(access_token);

    delete userData.iat;
    delete userData.exp;

    event.context.auth = userData;
})

export { authenticate }