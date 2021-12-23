const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.order).delete();

    await knex(tables.order).insert([
      {
        id: "7f28c5f9-c699-4cd6-ac15-d13d71abff84",
        user_id: "7f28c5f9-e711-5cd6-ac15-d13d71abff80",
        items: JSON.stringify([
          {
            id: "7f28c5f9-d711-4cd6-ac15-d13d71abff84",
            title: "item1",
            imagesrc: "/images/Afb3.jpg",
            type_id: "6f28c5f9-d711-4cd6-ac15-d13d71abff89",
            description: "Dit is een eerste voorbeeld",
            price: 9.99,
          },
          {
            id: "7f28c5f9-d711-4cd6-ac15-d13d71abff86",
            title: "item3",
            imagesrc: "/images/Afb4.jpg",
            type_id: "6f28c5f9-d711-4cd6-ac15-d13d71abff92",
            description: "Dit is een derde voorbeeld",
            price: 14.99,
          },
        ]),
      },
    ]);
  },
};
