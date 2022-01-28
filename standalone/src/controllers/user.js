const { database: { tables } } = require('../util/constants');

module.exports = function ({ database }) {
    // Prepared statement for getting a single user by ID
    const getUsersById = database.prepare(`
        SELECT U.id, U.username, U.name, L.name as license FROM "${tables.users}" AS U
            JOIN "${tables.licenses}" AS L
                ON U.license_id = L.id
            WHERE
                U.id = $1
            LIMIT 1
    `);

    // Prepared statement for creating a single user
    const createUser = database.prepare(`
        INSERT INTO "${tables.users}" (username, name, license_id)
            VALUES ($1, $2, $3)
    `);

    // Prepared statement for editing a single user
    const editUser = database.prepare(`
        UPDATE "${tables.users}"
            SET username = $2, name = $3, license_id = $4
            WHERE id = $1
    `);

    // Prepared statement for removing a single user
    const deleteUser = database.prepare(`
        DELETE FROM "${tables.users}"
            WHERE id = $1
    `);

    async function index(_, response) {
        let users;
        
        try {
            // Querying all users
            users = await database.query(`
                SELECT U.id, U.username, U.name, L.name as license FROM "${tables.users}" AS U
                    JOIN "${tables.licenses}" AS L
                        ON U.license_id = L.id
                    ORDER BY
                        U.id ASC
            `);
        } catch (err) {
            // Error on database forwarded to the client (not a good practice for production environment)
            return response
                .status(500)
                .json({
                    error: 'Database Error: ' + err.message
                });
        }

        // Return all the users
        return response.json(users);
    }

    async function get(request, response) {
        // Getting the user ID from the request route
        const { id } = request.params;

        // Converting the ID to an number
        const _id = Number(id);

        // Checking if the ID is valid
        if (!_id || isNaN(_id) || _id < 1) {
            // ID is not valid, return a 400 error
            return response
                .status(400)
                .json({
                    error: 'Invalid id'
                });
        }

        let user;

        try {
            // Querying the user by ID
            [ user ] = await getUsersById(_id);
        } catch (err) {
            // Error on database forwarded to the client (not a good practice for production environment)
            return response
                .status(500)
                .json({
                    error: 'Database Error: ' + err.message
                });
        }

        // Checking if the user exists
        if (!user) {
            // User does not exist, return a 404 error
            return response
                .status(404)
                .json({
                    error: 'User not found'
                });
        }

        // Return the user
        return response.json(user);
    }

    async function create(request, response) {
        // Getting the user data from the request body
        const { username, name, licenseType } = request.body;

        // Checking if the user data is valid
        if (!username || !name || !licenseType) {
            // User data is not valid, return a 400 error
            return response
                .status(400)
                .json({
                    error: 'Missing user data. The user must have a username, name and licenseType fields'
                });
        }

        try {
            // Creating the user
            await createUser(username, name, licenseType);
        } catch (err) {
            // Error on database forwarded to the client (not a good practice for production environment)
            return response
                .status(500)
                .json({
                error: 'Database Error: ' + err.message
            });
        }

        // Return the status Created to the client
        return response
            .status(201)
            .send();
    }

    async function edit(request, response) {
        // Getting the user ID from the request route
        const { id } = request.params;
        // Getting the user data from the request body
        const { username, name, licenseType } = request.body;

        // Converting the ID to an number
        const _id = Number(id);

        // Checking if the ID is valid
        if (!_id || isNaN(_id) || _id < 1) {
            // ID is not valid, return a 400 error
            return response
                .status(400)
                .json({
                    error: 'Missing id'
                });
        }

        // Checking if the user data is valid
        if (!username && !name && !licenseType) {
            // User data is not valid, return a 400 error
            return response
                .status(400)
                .json({
                    error: 'Missing user data. The user must have a username, name and licenseType fields'
                });
        }

        try {
            // Editing the user
            await editUser(id, username, name, licenseType);
        } catch (err) {
            // Error on database forwarded to the client (not a good practice for production environment)
            return response
                .status(500)
                .json({
                    error: 'Database Error: ' + err.message
                });
        }

        // Return the status No Content to the client
        return response
            .status(204)
            .send();
    }

    async function remove(request, response) {
        // Getting the user ID from the request route
        const { id } = request.params;

        // Converting the ID to an number
        const _id = Number(id);

        // Checking if the ID is valid
        if (!_id || isNaN(_id) || _id < 1) {
            // ID is not valid, return a 400 error
            return response
                .status(400)
                .json({
                    error: 'Missing id'
                });
        }

        try {
            // Removing the user
            await deleteUser(id);
        } catch (err) {
            // Error on database forwarded to the client (not a good practice for production environment)
            return response
                .status(500)
                .json({
                    error: 'Database Error: ' + err.message
                });
        }

        // Return the status No Content to the client
        return response
            .status(204)
            .send();
    }

    // Exporting the controller functions
    return {
        index,
        get,
        create,
        edit,
        remove
    };
};