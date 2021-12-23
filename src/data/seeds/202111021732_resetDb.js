const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    // first delete all entries in every table
    await knex(tables.item).delete();
    await knex(tables.type).delete();
  },
};
