const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.order, (table) => {
      table.uuid("id").primary();

      table.uuid("user_id").notNullable();

      table
        .foreign("user_id", "fk_order_user")
        .references(`${tables.user}.id`)
        .onDelete("CASCADE");

      table.jsonb("items").notNullable();
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.order);
  },
};
