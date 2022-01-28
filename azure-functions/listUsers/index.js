const { database: { tables } } = require('../common/util/constants');
const Database = require('../common/services/database');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const database = new Database();

    const users = await database.query(`
        SELECT U.id, U.username, U.name, L.name as license FROM "${tables.users}" AS U
            JOIN "${tables.licenses}" AS L
                ON U.license_id = L.id
            ORDER BY
                U.id ASC
    `);

    context.res = {
        body: users,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    await database.disconnect();

    return context.done();
}