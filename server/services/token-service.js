import tokenModel from "../models/token-model";
import jwt from "jsonwebtoken";
import helper from "../services/helper-service.js";

const JWT_ACCESS_SECRET  = 'q6gv!8z1bt5ofdtx-8!uqy8dr&iz0t&fire_a798&l8ssb9ki';
const JWT_REFRESH_SECRET = '627ta_f6-_gm44$tt-rp3ria5_d66gx34-&l70bdhpvg$';

class TokenService {
    generateTokens(payload) {
        const access_token = jwt.sign(payload, JWT_ACCESS_SECRET, {expiresIn: '10m'})
        const refresh_token = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            access_token,
            refresh_token
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            return false
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, JWT_REFRESH_SECRET)
            return userData
        } catch (e) {
            return false
        }
    }

    async saveToken(employee_id, refresh_token) {
        const tokenData = await tokenModel.getTokenByEmpId(employee_id)
        
        if (tokenData) {
            const result = await tokenModel.update(employee_id, refresh_token)
            return result
        } else {
            const result = await tokenModel.create(employee_id, refresh_token)
            return result
        }
    }

    async removeToken(refresh_token) {
        let result = await tokenModel.delete({refresh_token: refresh_token})
        
        if(result) return helper.resFormat(200, true)
        else return helper.resFormat(401, false)
    }

    async findToken(refresh_token) {
        const tokenData = await tokenModel.findToken(refresh_token)
        return tokenData;
    }
}

export default new TokenService();