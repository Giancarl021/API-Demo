const { database : { tables } } = require('../util/constants');

module.exports = function ({ database }) {
    async function index(_, response) {
        let licenses;

        try {
            // Querying all licenses
            licenses = await database.query(`
                SELECT L.* FROM "${tables.licenses}" AS L
                    ORDER BY
                        L.id ASC
            `);
        } catch (err) {
            // Error on database forwarded to the client (not a good practice for production environment)
            return response
                .status(500)
                .json({
                    error: 'Database Error: ' + err.message
                });
        }

        // Return all the licenses
        return response.json(licenses);
    }
    
    // Exporting the controller functions
    return { index };
}