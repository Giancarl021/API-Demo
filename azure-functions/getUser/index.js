const { database: { tables } } = require('../common/util/constants');
const Database = require('../common/services/database');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const { id } = (req.query || {});

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

    const database = new Database();

    const getUsersById = database.prepare(`
        SELECT U.id, U.username, U.name, L.name as license FROM "${tables.users}" AS U
            JOIN "${tables.licenses}" AS L
                ON U.license_id = L.id
            WHERE
                U.id = $1
            LIMIT 1
    `);

    const [ user ] = await getUsersById(_id);

    if (!user) {
        context.res = {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                error: 'User not found'
            }
        };
        return context.done();
    }

    context.res = {
        body: user,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    await database.disconnect();

    return context.done();
}