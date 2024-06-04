const userModel = require('../models/user-model')
const tokenService = require('./token-service')
const requestService = require('../services/request-service');
const SHA256 = require("crypto-js/sha256");
const ApiError = require('../exceptions/api-error');
const { query } = require('express');

class UserService {
   
    async login (reqData) {
        try {
            const userData = {
                login : reqData.login,
                password : reqData.password
            }
            const user = await userModel.getByLogin(userData.login, true);


            if (!user) {
                return requestService(400, `Пользователя с login: ${userData.login} не существует.`)
            } 

            const hash = SHA256(userData.password).toString()
       
            if (hash != user.password_hash) {
                return requestService(400, `Неверный пароль.`)
            }

            const userInfo = {
                id:          user.id,
                name:        user.firstname,
                last_name:   user.surname,
                patronymic:  user.fathername,
                login:       user.login,
            }

            const tokens = tokenService.generateTokens(userInfo)

            await tokenService.saveToken(user.id, tokens.refresh_token)

            delete user.password

            return requestService(200, {user: user}, tokens)

        } catch (e) {
            throw ApiError.BadRequest(e)
        }
    } 

    async logout(refresh_token) {
        if (refresh_token) {
            const token = await tokenService.removeToken(refresh_token)
            return token
        } else {
            return requestService(401)
        }
    }

    async refresh(refresh_token) {
        if (refresh_token) {
            const userData = tokenService.validateRefreshToken(refresh_token)
            const tokenFromDB = await tokenService.findToken(refresh_token)

            if (!userData || tokenFromDB.length == 0) {
                return requestService(401)
            }

            const user = await userModel.getByID(userData.id);

            if (!user) {
                return requestService(400, `Пользователя с id: ${userData.id} не существует.`)
            } 

            const tokens = tokenService.generateTokens({
                id:          user.id,
                name:        user.firstname,
                last_name:   user.surname,
                patronymic:  user.fathername,
                login:       user.login,
            })

            await tokenService.saveToken(user.id, tokens.refresh_token)

            return requestService(200, {user: { id: user.id}}, tokens)
        } else {
            return requestService(401)
        }
    }

    async getUsers(user) {
        if (user) {
            const users = await userModel.getAll();
            return users
        } else {
            return requestService(401)
        }
    }

    async getUser(req) {
        const user_id = req.params.id
        if (!req.user) {
            return requestService(401)
        }
        const userData = await userModel.getByID(user_id)
        if (!userData) {
            return requestService(404, 'Пользователь не найден')
        }
        const tokens = req.user.tokens
        return requestService(200, {user: userData}, tokens)        
    }

    async getRole(req) {
        const user_id = req.params.id
        if (req.user) {
            const userData = await userModel.getByID(user_id) 
            const role = await userModel.getRole(userData.role_id)
            if (!userData) {
                return requestService(404, 'Пользователь не найден')
            }
            return requestService(200, {role: role})        
        } else {
            return requestService(401)
        }
    }

    // async createUser(req) {
        
    // }
}

module.exports = new UserService()