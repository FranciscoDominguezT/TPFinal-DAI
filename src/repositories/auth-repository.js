import DBConfig from "../configs/db-config.js";
import pkg from 'pg';
const { Client } = pkg;

export default class AuthRepository {
    loginAsync = async (entity) => {
        const sql = 'SELECT id, username FROM users WHERE username = $1 AND password = $2';
        const values = [entity.username, entity.password];

        const result = await this.executeQuery(sql, values);

        return result.rows.length > 0 ? result.rows[0] : null;
    }

    registerAsync = async (entity) => {
        const sql = 'INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4) RETURNING id, username';
        const values = [entity.first_name, entity.last_name, entity.username, entity.password];

        const result = await this.executeQuery(sql, values);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    getUserProfileById = async (userId) => {
        const sql = 'SELECT id, first_name, last_name, username FROM users WHERE id = $1';
        const values = [userId];

        const result = await this.executeQuery(sql, values);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    checkIfUserExists = async (username) => {
        const sql = 'SELECT id FROM users WHERE username = $1';
        const result = await this.executeQuery(sql, [username]);
        return result.rows.length > 0;
    }

    executeQuery = async (query, params) => {
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const result = await client.query(query, params);
            return result;
        } catch (error) {
            console.error("Error ejecutando consulta:", error);
            throw error;
        } finally {
            await client.end();
        }
    }
}
