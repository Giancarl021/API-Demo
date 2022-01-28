const { database: { tables } } = require('../common/util/constants');
const Database = require('../common/services/database');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const { id } = (req.query || {});
    const { username, name, licenseType } = (req.body || {});

    const _id = Number(id);

    if (!_id || isNaN(_id) || _id < 1) {
        context.res = {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                error: 'Invalid id'
            }
        };
        return context.done();
    }

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

    const editUser = database.prepare(`
        UPDATE "${tables.users}"
            SET username = $2, name = $3, license_id = $4
            WHERE id = $1
    `);

    await editUser(_id, username, name, licenseType);

    context.res = {
        status: 204
    };

    await database.disconnect();

    return context.done();
}