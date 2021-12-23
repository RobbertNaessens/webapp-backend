const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.type, (table) => {
      table.uuid("id").primary();

      table.string("title", 255).notNullable(); 
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.type);
  },
};
