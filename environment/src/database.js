const knex = require('knex').default;
const locate = require('@giancarl021/locate');

const port = process.env.CONTAINER_PORT || 5432;
const user = process.env.POSTGRES_USER || 'postgres';
const password = process.env.POSTGRES_PASSWORD || 'postgres';
const database = process.env.POSTGRES_DATABASE || 'postgres';

const connection = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        port,
        user,
        password,
        database
    },
    migrations: {
        directory: locate('src/migrations')
    },

    seeds: {
        directory: locate('src/seeds')
    }
});

module.exports = async function ({ retries = 10, delay = 5000 } = {}) {
    let error;
    do {
        try {
            await connection.migrate.latest();
            await connection.seed.run();
    
            await connection.destroy();
            return;
        } catch (err) {
            error = err.message;
            retries--;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    } while (retries);

    await connection.destroy();
    throw new Error('Could not connect to database: ' + error);
}