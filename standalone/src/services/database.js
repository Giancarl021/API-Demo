const { Pool } = require('pg');

const port = process.env.DB_PORT || 5432;
const user = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || 'postgres';
const database = process.env.DB_DATABASE || 'postgres';

module.exports = function () {
    const pool = new Pool({ user, port, password, database });

    async function disconnect() {
        await pool.end();
    }

    async function query(query) {
        const result = await pool.query(String(query).trim());
        return result.rows;
    }

    function prepare(statement) {
        return async (...params) => {
            const result = await pool.query(statement, params);
            return result.rows;
        };
    }

    return {
        disconnect,
        query,
        prepare
    };
}