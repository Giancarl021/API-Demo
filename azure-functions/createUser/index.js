const { database: { tables } } = require('../common/util/constants');
const Database = require('../common/services/database');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Getting the user data from the request body
    const { username, name, licenseType } = (req.body || {});

    // Checking if the user data is valid
    if (!username || !name || !licenseType) {
        // User data is not valid, return a 400 error
        context.res = {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                error: 'Missing user data. The user must have a username, name and licenseType fields'
            }
        };
        // Ends the function execution context
        return context.done();
    }

    // Connect with the database
    const database = new Database();

    // Prepared statement for creating a single user
    const createUser = database.prepare(`
        INSERT INTO "${tables.users}" (username, name, license_id)
            VALUES ($1, $2, $3)
    `);

    // Creating the user
    await createUser(username, name, licenseType);

    // Return the status Created to the client
    context.res = {
        status: 201
    };

    // Disconnect with the database
    await database.disconnect();

    // Ends the function execution context
    return context.done();
}