const { database: { tables } } = require('../common/util/constants');
const Database = require('../common/services/database');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Connect with the database
    const database = new Database();

    // Querying all licenses
    const licenses = await database.query(`
        SELECT L.* FROM "${tables.licenses}" AS L
            ORDER BY
                L.id ASC
    `);

    // Return all the licenses
    context.res = {
        body: licenses,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Disconnect with the database
    await database.disconnect();

    // Ends the function execution context
    return context.done();
}