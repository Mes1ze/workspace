mysql = require('mysql2');

class Query {
    promisePool = null;
    
    async checkConnect(data) {
        let promisePool = false;
        let pool = false;
        if (data) {
            pool = mysql.createPool({
                host: data.host,
                user: data.user,
                database: data.database, 
                password: data.password
            });
            promisePool = pool.promise();
        } else {
            await this.checkFile();
            promisePool = this.promisePool
        }
        
        try {
            const [rows,fields] = await promisePool.query('SELECT "DATABASE CONNECT -------------------------------- \x1b[32mOK\x1b[0m" AS col');
            console.log(rows[0].col);
            return true
        } catch (error) {
            console.warn('DATABASE CONNECT ----------------------------- \x1b[31mERROR\x1b[0m');
            return false
        }
    }

    async checkFile() {
        
        let pool = false;
        let content = false;
        try {
            content = require('../config/db.json');
        } catch (error) {
            console.log(new Error('Не удалось подключиться к базе данных в функции checkFile()'))
        }

        if (content) {
            if (!content.host || !content.user || !content.database || !content.password) {
                console.log(new Error('Ошибка в файле конфигурации'))
            }
        }
        
        pool = mysql.createPool({
            host: content.host,
            user: content.user,
            database: content.database, 
            password: content.password
        });
        this.promisePool = pool.promise();
        
    }

    async enter (sql, params = []) {
    await this.checkFile()
    try {
            const [rows,fields] = await this.promisePool.query(sql, params);
            return rows
        } catch (error) {
            console.log(error);
        } 
    }

    async find(table, field = null, value = null, order = null, sort = 'ASC') {
        try {
            let sql

            if (field == null) {
                sql = `SELECT * FROM ${table}`
            } else {
                if (typeof value === 'string') {
                    value = `"${value}"`;
                }
                sql = `SELECT * FROM ${table} WHERE ${field} = ${value}`;
            }

            if (order != null) {
                sql += ` ORDER BY ${order} ${sort}`
            }

            return await this.enter(sql);
        } catch (error) {
            console.error('Query.find ------------ ERROR');
            console.log(error);
        }
    }

    async find_by_pages_new (table, params) {
             
        const default_params = {
            relation : AND,
            filters: [
                {
                    spec     : null, // Тип объекта (filter, relation)
                    type     : null, // Тип данных ()
                    field    : null,
                    value    : null,
                    compare  : null,
                    relation : null,
                }
            ],
            sort:   'ASC',
            page:   1,
            limit:  10,
        }

        params = Object.assign(default_params, params);
        try {
            let sql

            await array.forEach(element => {
            
            });

            if (params.field == null) {
                sql = `SELECT * FROM ${table}`
            } else {
                if (typeof params.value === 'string') {
                    sql = `SELECT * FROM ${table} WHERE ${params.field} = "${params.value}"`
                } else {
                    sql = `SELECT * FROM ${table} WHERE ${params.field} = ${params.value}`
                }
            }

            if (params.order != null) {
                sql += ` ORDER BY ${params.order} ${params.sort}`
            }


            sql += ` LIMIT ${(params.page - 1) * params.limit}, ${params.limit}`
            
            const data = await this.enter(sql);

            if (params.field == null) {
                sql = `SELECT COUNT(id) AS count FROM ${table}`
            } else {
                if (typeof params.value === 'string') {
                    sql = `SELECT COUNT(id) AS count FROM ${table} WHERE ${params.field} = "${params.value}"`
                } else {
                    sql = `SELECT COUNT(id) AS count FROM ${table} WHERE ${params.field} = ${params.value}`
                }
            }

            const count_result = await this.enter(sql);
            const count = count_result[0]?.count ?? 0;

            const pagination = {
                page_count: Math.ceil(count / params.limit),
                page:       Number(params.page),
            }

            return {
                data,
                pagination
            };
        } catch (error) {
            console.error('Query.find ------------ ERROR');
            console.log(error);
        }
    }

    async find_by_pages (table, params) {
        const default_params = {
            field:  null, 
            value:  null, 
            order:  null, 
            sort:   'ASC',
            page:   1,
            limit:  10,
        }

        params = Object.assign(default_params, params);
        try {
            let sql

            if (params.field == null) {
                sql = `SELECT * FROM ${table}`
            } else {
                if (typeof params.value === 'string') {
                    sql = `SELECT * FROM ${table} WHERE ${params.field} = "${params.value}"`
                } else {
                    sql = `SELECT * FROM ${table} WHERE ${params.field} = ${params.value}`
                }
            }

            if (params.order != null) {
                sql += ` ORDER BY ${params.order} ${params.sort}`
            }


            sql += ` LIMIT ${(params.page - 1) * params.limit}, ${params.limit}`
            
            const data = await this.enter(sql);

            if (params.field == null) {
                sql = `SELECT COUNT(id) AS count FROM ${table}`
            } else {
                if (typeof params.value === 'string') {
                    sql = `SELECT COUNT(id) AS count FROM ${table} WHERE ${params.field} = "${params.value}"`
                } else {
                    sql = `SELECT COUNT(id) AS count FROM ${table} WHERE ${params.field} = ${params.value}`
                }
            }

            const count_result = await this.enter(sql);
            const count = count_result[0]?.count ?? 0;

            const pagination = {
                page_count: Math.ceil(count / params.limit),
                page:       Number(params.page),
            }

            return {
                data,
                pagination
            };
        } catch (error) {
            console.error('Query.find ------------ ERROR');
            console.log(error);
        }
    }

    async insert(table, fields) {
        try {
            let sql = `INSERT INTO ${table} (`

            const count = Object.keys(fields).length
            let i = 0
            for (let field in fields) {
                i++
                sql += count == i ? field + ') VALUES (' : field + ', '
            }

            i = 0
            for (let field in fields) {
                i++
                if (typeof fields[field] === 'string') {
                    sql += count == i ? '"' + fields[field] + '");' : '"' + fields[field] + '",'
                } else {
                    sql += count == i ? fields[field] + ');' : fields[field] + ','
                }

            }

            return await this.enter(sql);
        } catch (error) {
            console.error('Query.insert ------------ ERROR');
            console.log(error);
        }
    } 

    async update(table, fields, where) {
        try {
            let sql = `UPDATE ${table} SET `

            const count = Object.keys(fields).length
            let i = 0
            for (let field in fields) {
                i++
                if (typeof fields[field] === 'string') {
                    sql += count == i ? field + ' = ' + '"' + fields[field] + '" WHERE ' : field + ' = ' +'"' + fields[field] + '", '
                } else {
                    sql += count == i ? field + ' = ' + fields[field] + ' WHERE ' : field + ' = ' + fields[field] + ', '
                }
            }
            
            const whereCount = Object.keys(where).length
            i = 0
            for (let whereField in where) {
                i++
                if (typeof where[whereField] === 'string') {
                    sql += whereCount == i ? whereField + ' = ' + '"' + where[whereField] + '" ' : whereField + ' = ' +'"' + where[whereField] + '" AND '
                } else {
                    sql += whereCount == i ? whereField + ' = ' + where[whereField] + ' ' : whereField + ' = ' + where[whereField] + ' AND '
                }
            }

            return await this.enter(sql);
        } catch (error) {
            console.error('Query.update ------------ ERROR');
            console.log(error);
        }
    }

    async delete(table, where) {
        try {
            let sql = `DELETE FROM ${table} WHERE `

            const whereCount = Object.keys(where).length
            let i = 0
            for (let whereField in where) {
                i++
                if (typeof where[whereField] === 'string') {
                    sql += whereCount == i ? whereField + ' = ' + '"' + where[whereField] + '" ' : whereField + ' = ' +'"' + where[whereField] + '" AND '
                } else {
                    sql += whereCount == i ? whereField + ' = ' + where[whereField] + ' ' : whereField + ' = ' + where[whereField] + ' AND '
                }
            }

            return await this.enter(sql);
        } catch (error) {
            console.error('Query.delete ------------ ERROR');
            console.log(error);
        }
    }
    async select(table, where){
        try {
            let sql = `SELECT * FROM ${table} WHERE `;
            const whereCount = Object.keys(where).length
            let i = 0
            for (let whereField in where) {
                i++
                if (typeof where[whereField] === 'string') {
                    sql += whereCount == i ? whereField + ' = ' + '"' + where[whereField] + '" ' : whereField + ' = ' +'"' + where[whereField] + '" AND '
                } else {
                    sql += whereCount == i ? whereField + ' = ' + where[whereField] + ' ' : whereField + ' = ' + where[whereField] + ' AND '
                }
            }
            return await this.enter(sql);
        }catch (error) {
            console.error('Query.update ------------ ERROR');
            console.log(error);
        }
    }
} 



module.exports = new Query()