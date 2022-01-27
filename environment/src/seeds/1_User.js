const tableName = 'User';

module.exports = {
    async seed(knex) {
        const { rows } = await knex(tableName)
            .count('id as rows')
            .first();

        if (rows > 0) return;

        return await knex(tableName)
            .insert([
                {
                    username: 'admin',
                    name: 'Administrator',
                    license_id: 3
                },
                {
                    username: 'the_master_j0hn',
                    name: 'John',
                    license_id: 2
                },
                {
                    username: 'the_p00r_jane',
                    name: 'Jane',
                    license_id: 1
                }
            ]);
    }
}