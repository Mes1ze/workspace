const userService = require('../services/user-service')

class UserController {
    async login (req, res, next) {
        try {
            const userData = await userService.login(req.body)
            if (userData.status.text == 'success') {
                res.cookie('refresh_token', userData.tokens.refresh_token, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: false})
            }
            res.status(userData.status.number).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout (req, res, next) {
        try {
            const refresh_token = req.cookies.refresh_token;
            const token = await userService.logout(refresh_token)
            res.clearCookie('refresh_token')
            res.status(200).json(token)
        } catch (e) {
            next(e)
        }
    }

    async refresh (req, res, next) {
        try {
            const refresh_token = req.cookies.refresh_token;
            const userData = await userService.refresh(refresh_token)
            if (userData.status.text == 'success') {
                res.cookie('refresh_token', userData.tokens.refresh_token, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: false})
            }
            res.status(userData.status.number).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getUsers (req, res, next) {
        try {
            const users = await userService.getUsers(req.user)
            res.status(200).json(users)
        } catch (e) {
            next(e)
        }
    }

    async getUser (req, res, next) {
        try {
            const user = await userService.getUser(req)
            res.status(200).json(user)
        } catch (e) {
            next(e)
        }
    }

    async getRole (req, res, next) {
        try {
            const role = await userService.getRole(req)
            res.status(200).json(role)
        } catch (e) {
            next(e)
        }
    }
    async createUser(req, res, next) {
        try {
            const role = await userService.createUser(req)
            res.status(200).json(role)
        } catch (e) {
            next(e)
        }
    }
    async updateUser(req, res, next) {
        try {
            const role = await userService.updateUser(req)
            res.status(200).json(role)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()