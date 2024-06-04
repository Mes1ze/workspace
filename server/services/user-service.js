import UserModel from "~/server/models/user-model";
import tokenService from "~/server/services/token-service";
import helper from "~/server/services/helper-service";
import RoleService from "~/server/services/role-service";

const userModel = new UserModel()
const roleService = new RoleService()

class UserService {
    async login(ctx) {
        try {
            ctx.returnHash = true;
            const user = await userModel.get(ctx);
            
            if (!user) {
                return helper.resFormat(404, `Пользователя с логином '${ctx.login}' не существует.`)
            } 
            
            const hash = await helper.hash(ctx.password)
       
            if (hash != user.password_hash) {
                return helper.resFormat(401, `Неверный пароль.`)
            }

            const userInfo = {
                id         : user.id,
                firstname  : user.firstname,
                surname    : user.surname,
                fathername : user.fathername,
                login      : user.login,
            }

            delete user.password_hash;
            
            const tokens = tokenService.generateTokens(userInfo)
            await tokenService.saveToken(user.id, tokens.refresh_token)
            
            return helper.resFormat(200, {
                user: user,
                tokens: tokens
            })
        } catch (e) {
            console.log(e);
            return helper.resFormat(401)
        }
    } 

    async logout(ctx) {
        try {
            const refresh_token = ctx.refresh_token

            if (!refresh_token) return helper.resFormat(401)
            
            await tokenService.removeToken(refresh_token)
            return helper.resFormat(202)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async refresh(ctx) {
        try {
            const refresh_token = ctx.refresh_token

            if (!refresh_token) return helper.resFormat(401)
            
            const userData = tokenService.validateRefreshToken(refresh_token)
            const tokenFromDB = await tokenService.findToken(refresh_token)

            if (!userData) {
                return helper.resFormat(401, 'Невалидный токен')
            }

            if (!tokenFromDB) {
                return helper.resFormat(401, 'Токен не найден')
            }

            const user = await userModel.get({
                id: +userData.id
            })

            if (!user) {
                return helper.resFormat(404, `Пользователя с id '${userData.id}' не существует.`)
            } 

            const userInfo = {
                id         : user.id,
                firstname  : user.firstname,
                surname    : user.surname,
                fathername : user.fathername,
                login      : user.login,
            }

            const tokens = tokenService.generateTokens(userInfo)

            await tokenService.saveToken(user.id, tokens.refresh_token)

            return helper.resFormat(200, tokens)
        } catch(e) {
            console.log(e)
            return helper.resFormat(400, false)
        }
    }

    async getUsers(ctx) {
        try {
            const params = {
                surname: ctx.surname,
                page: ctx.page,
                count: ctx.count
            }

            // const data = {
            //     select: select,
            //     where: where,
            //     params: params
            // }

            const result = await userModel.getAll(params)
            
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(404, false)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async getUser(ctx) {
        try {

            const result = await userModel.get(ctx)
            
            if(result) {
                const permissions = await roleService.getPermissions(result.id)
                result.permissions = permissions.data

                return helper.resFormat(200, result)
            } else return helper.resFormat(404, false)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async getRole(ctx) {
        try {
            const userData = await userModel.get(ctx)
            if (!userData) return helper.resFormat(404,'Пользователь не найден')

            const role = userData.roles
            
            return helper.resFormat(200, role)
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async createUser(ctx) {
        try {
            const data = {
                firstname     : ctx.firstname,
                surname       : ctx.surname,
                fathername    : ctx.fathername,
                role_id       : ctx.role_id,
                login         : ctx.login,
                password_hash : await helper.hash(ctx.password),
                returnHash: false,
            }
            const result = await userModel.create(data)
            if (result) {
                return helper.resFormat(200, result)
            } else {
                return helper.resFormat(400)
            }
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }

    async updateUser(ctx) {
        try {
            const result = await userModel.update(ctx)
            if (result) {
                return helper.resFormat(200, result)
            } else {
                return helper.resFormat(400)
            }
        } catch(e) {
            console.log(e)
            return helper.resFormat(500)
        }
    }
}

export default UserService