const { Pool } = require('pg');

const port = process.env.DB_PORT || 5432;
const user = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || 'postgres';
const database = process.env.DB_DATABASE || 'postgres';

module.exports = function ({ autoConnect = false } = {}) {
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
        await ensureClient();

        return (await context.client.query(String(query).trim())).rows;
    }

    function prepare(statement) {
        return async (...params) => {
            await ensureClient();
            return (await context.client.query(statement, params)).rows;
        };
    }

    async function ensureClient() {
        if (!context.client) {
            if (!autoConnect) throw new Error('Not connected to database');
            
            await connect();
        }
    }

    return {
        connect,
        disconnect,
        query,
        prepare
    };
}