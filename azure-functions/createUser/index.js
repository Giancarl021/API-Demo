const { database: { tables } } = require('../common/util/constants');
const Database = require('../common/services/database');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const { username, name, licenseType } = (req.body || {});

    if (!username || !name || !licenseType) {
        context.res = {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                error: 'Missing user data. The user must have a username, name and licenseType fields'
            }
        };
        return context.done();
    }

    const database = new Database();

    const createUser = database.prepare(`
        INSERT INTO "${tables.users}" (username, name, license_id)
            VALUES ($1, $2, $3)
    `);

    await createUser(username, name, licenseType);

    context.res = {
        status: 201
    };

    await database.disconnect();

    return context.done();
}