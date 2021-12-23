module.exports = {
  log: {
    level: "info",
    disabled: false,
  },
  cors: {
    origins: ["http://localhost:3000"],
    maxAge: 3 * 60 * 60, // 3h in seconds
  },
  database: {
    client: "mysql2",
    host: "localhost",
    port: 3306,
    name: "mydatabank",
    username: "root",
    password: "f7CcwRvM&zU2vYqk&g42OF%YAM",
  },
  pagination: {
    limit: 100,
    offset: 0,
  },
};
