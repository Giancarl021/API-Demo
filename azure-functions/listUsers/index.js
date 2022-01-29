const { database: { tables } } = require('../common/util/constants');
const Database = require('../common/services/database');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Connect with the database
    const database = new Database();

    // Querying all users
    const users = await database.query(`
        SELECT U.id, U.username, U.name, L.name as license FROM "${tables.users}" AS U
            JOIN "${tables.licenses}" AS L
                ON U.license_id = L.id
            ORDER BY
                U.id ASC
    `);

    // Return all the users
    context.res = {
        body: users,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Disconnect with the database
    await database.disconnect();

    // Ends the function execution context
    return context.done();
}