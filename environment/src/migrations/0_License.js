const tableName = 'License';

module.exports = {
    up(knex) {
        return knex.schema.createTable(tableName, table => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.double('price', 2).notNullable();
        });
    },

    down(knex) {
        return knex.schema.dropTable(tableName);
    }
}