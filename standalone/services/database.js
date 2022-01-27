const { Pool } = require('pg');

const port = process.env.DB_PORT || 5432;
const user = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || 'postgres';
const database = process.env.DB_DATABASE || 'postgres';

module.exports = function () {
    const context = {};
    const pool = new Pool({ user, port, password, database });

    async function connect() {
        if (context.client) return;
        context.client = await pool.connect();
    }

    async function disconnect() {
        if (!context.client) return;
        context.client = null;
        await pool.end();
    }

    async function query(query) {
        ensureClient();

        return await context.client.query(query);
    }

    function prepare(statement) {
        ensureClient();

        return async (...params) => {
            ensureClient();
            return await context.client.query(statement, params);
        };
    }

    function ensureClient() {
        if (!context.client) throw new Error('Not connected to database');
    }

    return {
        connect,
        disconnect,
        query,
        prepare
    };
}