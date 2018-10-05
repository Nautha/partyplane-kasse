const mysql = require('mysql2/promise');


class DatabaseController {
    constructor() {
        this.host = process.env.DB_HOST;
        this.port = process.env.DB_PORT;
        this.user = process.env.DB_USER;
        this.password = process.env.DB_PASSWORD;
        this.database = process.env.DB_DATABASE;
    }

    async _connect() {
        this.connection = await mysql.createConnection({
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
            database: this.database
        });
    }

    async query(query, parameters = []) {
        try {
            return await this._executePreparedStatement(query, parameters);
        } catch (e) {
            throw e;
        }
    }

    async _executePreparedStatement(query, parameters = []) {
        try {
            const [rows, fields] = await this.connection.execute(query, parameters);
            return rows;
        } catch (e) {
            console.log("Error", e);
            throw e;
        }
    }

    async doesTableExist() {
        try {
            // return await this.connection.query('SELECT count(*) FROM information_schema.TABLES WHERE (TABLE_SCHEMA = \'partyplane-kasse\') AND (TABLE_NAME = \'users\')')
            return await this.connection.query('SHOW TABLES LIKE \'users\'');
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async createTable(query) {
        try {
            return await this.connection.query(query);
        } catch (e) {
            throw (e);
        }
    }
}

module.exports = {DatabaseController};