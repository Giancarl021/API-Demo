const { database: { tables } } = require('../common/util/constants');
const Database = require('../common/services/database');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Getting the user ID from the request query parameters
    const { id } = (req.query || {});
    
    // Getting the user data from the request body
    const { username, name, licenseType } = (req.body || {});

    // Converting the ID to an number
    const _id = Number(id);

    // Checking if the ID is valid
    if (!_id || isNaN(_id) || _id < 1) {
        // ID is not valid, return a 400 error
        context.res = {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                error: 'Invalid id'
            }
        };
        // Ends the function execution context
        return context.done();
    }

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
    const database = Database();

    // Prepared statement for updating a single user
    const editUser = database.prepare(`
        UPDATE "${tables.users}"
            SET username = $2, name = $3, license_id = $4
            WHERE id = $1
    `);

    // Updating the user
    await editUser(_id, username, name, licenseType);

    // Return the status No Content to the client
    context.res = {
        status: 204
    };

    // Disconnect with the database
    await database.disconnect();

    // Ends the function execution context
    return context.done();
}