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

    const deleteUser = database.prepare(`
        DELETE FROM "${tables.users}"
            WHERE id = $1
    `);

    await deleteUser(_id);

    context.res = {
        status: 204
    };

    await database.disconnect();

    return context.done();
}