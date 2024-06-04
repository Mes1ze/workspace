const query = require('../database/query')

class UserModel {

    async getByLogin(login, password = false) { 
        return this.getUser('login', login, password)
    }

    async create (user) {
        const result = await query.insert('users', user)
        const newUser = {
            id: result.insertId,
            ...user
        }

        delete newUser.password

        return newUser
    }

    async update (id, fields) {
        const result = await query.update('users', fields, {id: id})
        return result
    }

    async getAll () {
        const result = await query.find('employee')

        result.forEach(element => {
            delete element.password
        });

        return result
    }

    async getUser (field, value, password = false) {
        const user_bd = await query.find('employee', field, value)
        if (user_bd.length > 0) {
            const user = user_bd[0]
            if (!password) {
                delete user.password
            }
            
            return user
        } else {
            return false
        }
    }

    async getByID (id) {
        const user = await this.getUser('id', id)
        // delete user.role_id;
        return user;
    }

    async roleCheck(user_id, role_name) {    
        const user = await this.getByID(user_id)
        if (!user) {
            return false
        }
        const result = (user.role == role_name)
        return result
    }

    async getRole (id) {
        const role = await query.find('roles', 'id', id)
        if (!role) {
            return false
        }
        return role[0].name
    }

    async delete (id) {
        
    }

}

module.exports = new UserModel()
