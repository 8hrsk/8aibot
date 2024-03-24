
const knex = require('knex')

module.exports = class Database {

    constructor(databaseAuthData) {
        this.knex = knex({
            client: 'mysql2',
            connection: {
                host: databaseAuthData.host,
                user: databaseAuthData.user,
                password: databaseAuthData.password,
                database: databaseAuthData.database
            }
        })
    }

    async getSession(callback) {
        return this.knex.select()
            .from('sessions')
            .orderBy('id', 'desc')
            .limit(1)
            .then((data) => {
                return callback(data[0])
            })
    }

    async setSession(session) {
        return this.knex('sessions').insert(session)
            .then((result) => {
                console.log(result);
            })
    }
}