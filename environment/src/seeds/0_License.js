const tableName = 'License';

module.exports = {
    async seed(knex) {
        const { rows } = await knex(tableName)
            .count('id as rows')
            .first();

        if (rows > 0) return;

        return await knex(tableName)
            .insert([{
                    name: 'Free',
                    price: 0
                },
                {
                    name: 'Basic',
                    price: 9.99
                },
                {
                    name: 'Pro',
                    price: 19.99
                }
            ]);
    }
}