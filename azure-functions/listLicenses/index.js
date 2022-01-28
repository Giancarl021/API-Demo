const { database: { tables } } = require('../common/util/constants');
const Database = require('../common/services/database');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const database = new Database();

    const licenses = await database.query(`
        SELECT L.* FROM "${tables.licenses}" AS L
            ORDER BY
                L.id ASC
    `);

    context.res = {
        body: licenses,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    await database.disconnect();

    return context.done();
}