const query = require('../database/query')

class TokenModel {

    async create (tokens) {
        const result = await query.insert('tokens', tokens)
        return {tokens}
    }

    async getUserById (id) {
        const result = await query.find('tokens', 'employee_id', id)
        return result
    }

    async findToken (refresh_token) {
        const result = await query.find('tokens', 'refresh_token', refresh_token)
        return result
    }

    async update (employee_id, refresh_token, access_token) {
        const result = await query.update('tokens', {refresh_token: refresh_token, access_token: access_token}, {employee_id: employee_id});
        return result
    }

    async delete (where) {
        const result = await query.delete('tokens', where)
        return result
    }

    async verifyAccess(token, user){
        const result = await query.find('tokens', 'employee_id', user.id);
        return result
    }

}

module.exports = new TokenModel()