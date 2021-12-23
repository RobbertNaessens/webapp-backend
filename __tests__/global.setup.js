const config = require("config");
const { initializeLogger } = require("../src/core/logging");
const { initializeData, getKnex, tables } = require("../src/data");
const Role = require("../src/core/roles");

module.exports = async () => {
  initializeLogger({
    level: config.get("log.level"),
    disabled: config.get("log.disabled"),
  });

  await initializeData();

  const knex = getKnex();
  await knex(tables.user).insert([
    {
      id: "7f28c5f9-e711-5cd6-ac15-d13d71abff80",
      name: "Test User",
      email: "test.user@hogent.be",
      password_hash:
        "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
      roles: JSON.stringify([Role.USER]),
    },
    {
      id: "7f28c5f9-e711-5cd6-ac15-d13d71abff81",
      name: "Admin User",
      email: "admin.user@hogent.be",
      password_hash:
        "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
      roles: JSON.stringify([Role.ADMIN, Role.USER]),
    },
  ]);
};
