import helper from "~/server/services/helper-service"
import { PrismaClient } from "@prisma/client"

const client = new PrismaClient()

class UserModel {
    async create (ctx) {
        try {
            const user = {
                role_id: +ctx.role_id || 1,
                firstname: ctx.firstname,
                surname: ctx.surname,
                fathername: ctx.fathername,
                login: ctx.login,
                password_hash: ctx.password_hash,
            }

            const result = await client.employee.create({
                data: user
            })

            if(!result) return false

            if(!ctx.returnHash) delete result.password_hash

            return result
        } catch(e) {
            console.log(e)
            return false
        }
    }

    async update(ctx) {
        try {
            const data = {
                firstname:     ctx.firstname,
                surname:       ctx.surname,
                fathername:    ctx.fathername,
                role_id:      +ctx.role_id || undefined,
                login:         ctx.login,
                password_hash: ctx.password ? await helper.hash(ctx.password) : undefined
            }
            const result = await client.employee.update({
                where: {
                    id: +ctx.id
                },
                data: data
            })
    
            if(!ctx.returnHash) delete result.password_hash
    
            return result
        } catch(error) {
            console.error(error)
            return false
        }
    }

    async getAll(ctx) {
        try {
            const select = ctx.select ?? await helper.constructDefaultSelect(client.employee, [
                "roles"
            ])
            const where = {
                surname: ctx.surname
            }
            const pagination = {
                page: +ctx.page,
                count: +ctx.count
            }
            
            const result = pagination
                ? await helper.getAllPaginated(client.employee, select, where, pagination)
                : await client.employee.findMany({
                    select: select,
                    where: where
                });
            

            // if(!ctx.returnHash) (pagination ? result.result : result).forEach(employee => {
            //     delete employee.password_hash
            // }) 

            if(result) return result
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }

    async get(ctx) {
        try {
            const select = ctx.select ?? await helper.constructDefaultSelect(client.employee, [
                "roles"
            ])
            let where = new Object();
            if(ctx.id != undefined) {
                where.id = +ctx.id
            }
            if(ctx.login != undefined) {
                where.login = ctx.login
            }
            
            const result = await client.employee.findUnique({
                select: select,
                where: where
            });

            if(!ctx.returnHash) {
                try { delete result.password_hash } catch(e) {}
            }

            if(result) return result
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }

    async roleCheck(ctx) {
        try {
            const result = this.get({
                select: {
                    roles: true
                },
                where: {
                    id: +ctx.user_id
                },
            })

            if (!result) {
                return false
            }

            const check = (result.roles.name == ctx.role_name)
            return check
        } catch(e) {
            console.log(e)
            return false
        }
    }

    async delete(ctx) {
        try {
            const where = ctx.where
            
            const result = await client.employee.deleteMany({
                where: where
            });

            if(result) return true
            else return false
        } catch(e) {
            console.log(e)
            return false
        }
    }

}

export default UserModel
