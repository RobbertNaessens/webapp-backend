const { tables } = require("..");
const Role = require("../../core/roles");

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.user).delete();

    // then add the fresh users (all passwords are 12345678)
    await knex(tables.user).insert([
      {
        id: "7f28c5f9-e711-5cd6-ac15-d13d71abff80",
        name: "Robbert Naessens",
        email: "robbert.naessens@hogent.be",
        password_hash:
          "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
        roles: JSON.stringify([Role.ADMIN, Role.USER]),
      },
      {
        id: "7f28c5f9-e711-5cd6-ac15-d13d71abff81",
        name: "Wendy Beyst",
        email: "robbert.naessens@hotmail.be",
        password_hash:
          "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
        roles: JSON.stringify([Role.ADMIN, Role.USER]),
      },
      {
        id: "7f28c5f9-e711-5cd6-ac15-d13d71abff82",
        name: "Random Klant",
        email: "robbertnaessens@gmail.com",
        password_hash:
          "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
        roles: JSON.stringify([Role.USER]),
      },
    ]);
  },
};
