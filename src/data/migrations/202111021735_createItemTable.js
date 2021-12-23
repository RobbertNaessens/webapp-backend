const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.item, (table) => {
      table.uuid("id").primary();

      table.string("title", 255).notNullable();

      table.string("imagesrc", 500).notNullable();

      table.uuid("type_id").notNullable();

      table
        .foreign("type_id", "fk_item_type")
        .references(`${tables.type}.id`)
        .onDelete("CASCADE");

      table.string("description", 255);

      table.decimal("price", 5, 2).notNullable();
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.item);
  },
};
