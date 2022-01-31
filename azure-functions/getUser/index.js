const { database: { tables } } = require('../common/util/constants');
const Database = require('../common/services/database');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Getting the user ID from the request query parameters
    const { id } = (req.query || {});

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

    // Connect with the database
    const database = Database();

    // Prepared statement for getting a single user by ID
    const getUsersById = database.prepare(`
        SELECT U.id, U.username, U.name, L.name as license FROM "${tables.users}" AS U
            JOIN "${tables.licenses}" AS L
                ON U.license_id = L.id
            WHERE
                U.id = $1
            LIMIT 1
    `);

    // Querying the user by ID
    const [ user ] = await getUsersById(_id);

    // Checking if the user exists
    if (!user) {
        // User does not exist, return a 404 error
        context.res = {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                error: 'User not found'
            }
        };
        // Ends the function execution context
        return context.done();
    }

    // Return the user
    context.res = {
        body: user,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Disconnect with the database
    await database.disconnect();

    // Ends the function execution context
    return context.done();
}