const { Pool } = require('pg');

// Define the database credentials from environment variables or by hard-coded default values
const port = process.env.DB_PORT || 5432;
const user = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || 'postgres';
const database = process.env.DB_DATABASE || 'postgres';

module.exports = function () {
    // Create a new database connection pool object
    const pool = new Pool({ user, port, password, database });

    // Disconnect the application from the database pool
    async function disconnect() {
        await pool.end();
    }

    // Single query to the database
    async function query(query) {
        const result = await pool.query(String(query).trim());
        return result.rows;
    }

    // Create a prepared statement to run later
    function prepare(statement) {
        // Return a function that will run the prepared statement with specified parameters
        return async (...params) => {
            const result = await pool.query(statement, params);
            return result.rows;
        };
    }

    // Exporting the database functions
    return {
        disconnect,
        query,
        prepare
    };
}