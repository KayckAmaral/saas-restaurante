import mysql from 'mysql2';

export default class Database {

    #conexao;

    get conexao() { return this.#conexao; }
    set conexao(value) { this.#conexao = value; }

    constructor() {
        this.#conexao = mysql.createPool({
            host:            process.env.DB_HOST     || '137.131.181.176',
            port:            process.env.DB_PORT     || 3306,
            database:        process.env.DB_NAME     || 'DB_ESTAGIO',
            user:            process.env.DB_USER     || 'kayck',
            password:        process.env.DB_PASSWORD || 'Kayck@2026Aula',
            idleTimeout:     30000,
            connectionLimit: 50
        });
    }

    ExecutaComando(sql, valores) {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query(sql, valores, (error, results) => {
                if (error) rej(error);
                else res(results);
            });
        });
    }

    ExecutaComandoNonQuery(sql, valores) {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query(sql, valores, (error, results) => {
                if (error) rej(error);
                else res(results.affectedRows > 0);
            });
        });
    }

    ExecutaComandoLastInserted(sql, valores) {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query(sql, valores, (error, results) => {
                if (error) rej(error);
                else res(results.insertId);
            });
        });
    }

    AbreTransacao() {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query('START TRANSACTION', (error, results) => {
                if (error) rej(error);
                else res(results);
            });
        });
    }

    Commit() {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query('COMMIT', (error, results) => {
                if (error) rej(error);
                else res(results);
            });
        });
    }

    Rollback() {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query('ROLLBACK', (error, results) => {
                if (error) rej(error);
                else res(results);
            });
        });
    }
}
