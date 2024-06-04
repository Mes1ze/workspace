const ApiError = require('../exceptions/api-error');
const tokenService = require('../services/token-service');
const userService = require('../services/user-service')
const requestService = require('../services/request-service')


module.exports = async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }
        
        const access_token = authorizationHeader.split(' ')[1];
        if (!access_token) {
            return next(ApiError.UnauthorizedError());
        }
        
        let userData = await tokenService.validateAccessToken(access_token);
        if (!userData){
            return next(ApiError.UnauthorizedError());
        }

        if (!userData) {
            const refresh_token = req.cookies.refresh_token;
            userData = await userService.refresh(refresh_token)
            res.cookie('refresh_token', userData.tokens.refresh_token, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: false})

            userData = userData.content.user
        } else {
            userData.tokens = {
                refresh_token: req.cookies.refresh_token,
                access_token: access_token
            }
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};