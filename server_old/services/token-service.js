const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService {
    generateTokens(payload) {
        const access_token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refresh_token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            access_token,
            refresh_token
        }
    }

    async validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            const tokens = await tokenModel.verifyAccess(token, userData);
            let access = false;
            tokens.forEach(User => {
                if (User.access_token == token){
                    access = true;
                }
            });
            if (!access){
                return null;
            }
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    async saveToken(employee_id, refresh_token, access_token) {
        const tokenData = await tokenModel.getUserById(employee_id)
        if (tokenData.length > 0) {
            const result = await tokenModel.update(employee_id, refresh_token, access_token)
            return result
        }
        const result = await tokenModel.create({employee_id: employee_id, refresh_token: refresh_token})
        return result
    }

    async removeToken(refresh_token) {
        await tokenModel.delete({refresh_token: refresh_token})
        return refresh_token;
    }

    async findToken(refresh_token) {
        const tokenData = await tokenModel.findToken(refresh_token)
        return tokenData;
    }
}

module.exports = new TokenService();