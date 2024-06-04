import query from "../database/query"
import { PrismaClient } from "@prisma/client"

const client = new PrismaClient()

class TokenModel {

    async create (employee_id, refresh_token) {
        const result = await client.tokens.create({ data: { employee_id, refresh_token } }) //query.insert('tokens', tokens)
        return result
    }

    async getTokenByEmpId (id) {
        const result = await client.tokens.findFirst({ where: { employee_id: id }}) //query.find('tokens', 'employee_id', id)
        return result
    }

    async findToken (refresh_token) {
        const result = await client.tokens.findFirst({ where: { refresh_token: refresh_token }}) //query.find('tokens', 'refresh_token', refresh_token)
        return result
    }

    async update (employee_id, refresh_token) {
        const result = await client.tokens.updateMany({ data: { refresh_token: refresh_token },  where: { employee_id: employee_id }}) //query.update('tokens', {refresh_token: refresh_token, access_token: access_token}, {employee_id: employee_id})
        return result
    }

    async delete (where) {
        const result = await client.tokens.deleteMany({ where }) //query.delete('tokens', where)
        if(result && result.count) return true
        else return false
    }
}

export default new TokenModel()