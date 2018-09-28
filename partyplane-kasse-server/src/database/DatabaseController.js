const mysql = require('mysql2');


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
        return await this._executePreparedStatement(query, parameters);
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
}

module.exports = {DatabaseController};