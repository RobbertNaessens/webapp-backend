const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.type).delete();

    // then add the fresh users (all passwords are 12345678)
    await knex(tables.type).insert([
      {
        id: "6f28c5f9-d711-4cd6-ac15-d13d71abff84",
        title: "Oorbellen",
      },
      {
        id: "6f28c5f9-d711-4cd6-ac15-d13d71abff85",
        title: "Armbanden",
      },
      {
        id: "6f28c5f9-d711-4cd6-ac15-d13d71abff86",
        title: "Ketting",
      },
      {
        id: "6f28c5f9-d711-4cd6-ac15-d13d71abff87",
        title: "Juwelen setje",
      },
      {
        id: "6f28c5f9-d711-4cd6-ac15-d13d71abff88",
        title: "Juwelen setje kinderen",
      },
      {
        id: "6f28c5f9-d711-4cd6-ac15-d13d71abff89",
        title: "Sleutelhanger",
      },
      {
        id: "6f28c5f9-d711-4cd6-ac15-d13d71abff90",
        title: "Kaarsen",
      },
      {
        id: "6f28c5f9-d711-4cd6-ac15-d13d71abff91",
        title: "Geschenken",
      },
      {
        id: "6f28c5f9-d711-4cd6-ac15-d13d71abff92",
        title: "Gemaakte beelden",
      },
      {
        id: "6f28c5f9-d711-4cd6-ac15-d13d71abff93",
        title: "Gekochte beelden",
      },
      {
        id: "6f28c5f9-d711-4cd6-ac15-d13d71abff94",
        title: "Kerst geschenken",
      },
    ]);
  },
};
