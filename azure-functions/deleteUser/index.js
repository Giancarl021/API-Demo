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
    const database = new Database();

    // Prepared statement for deleting a single user
    const deleteUser = database.prepare(`
        DELETE FROM "${tables.users}"
            WHERE id = $1
    `);

    // Deleting the user
    await deleteUser(_id);

    // Return the status No Content to the client
    context.res = {
        status: 204
    };

    // Disconnect with the database
    await database.disconnect();

    // Ends the function execution context
    return context.done();
}