const tableName = 'User';

module.exports = {
    up(knex) {
        return knex.schema.createTable(tableName, table => {
            table.increments('id').primary();
            table.string('username').unique().notNullable();
            table.string('name').notNullable();
            table.integer('license_id').references('id').inTable('License').notNullable();
        });
    },

    down(knex) {
        return knex.schema.dropTable(tableName);
    }
}