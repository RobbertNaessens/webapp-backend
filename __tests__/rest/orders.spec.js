const { tables } = require("../../src/data");
const { withServer, loginAdmin } = require("../supertest.setup");

const data = {
  orders: [
    {
      id: "ebda9b24-4e97-4229-a419-efd1dea56e01",
      user_id: "5e28c5f9-d711-4cd6-ac15-d13d71abff89",
      items: JSON.stringify([
        {
          id: "7f28c5f9-d711-5555-ac15-d13d71abff84",
          title: "item1",
          imagesrc: "/images/Afb3.jpg",
          type_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff89",
          description: "Dit is een eerste voorbeeld",
          price: 9.99,
        },
        {
          id: "7f28c5f9-d711-5555-ac15-d13d71abff85",
          title: "item2",
          imagesrc: "/images/Afb3.jpg",
          type_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff89",
          description: "Dit is een tweede voorbeeld",
          price: 19.99,
        },
      ]),
    },
    {
      id: "7f28c5f9-abcd-4cd6-ac15-d13d71abff85",
      user_id: "5e28c5f9-d711-4cd6-ac15-d13d71abff90",
      items: JSON.stringify([
        {
          id: "7f28c5f9-d711-5555-ac15-d13d71abff86",
          title: "item1",
          imagesrc: "/images/Afb3.jpg",
          type_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff89",
          description: "Dit is een eerste voorbeeld",
          price: 9.99,
        },
      ]),
    },
  ],
  types: [
    {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abff89",
      title: "Sleutelhanger",
    },
  ],
  users: [
    {
      id: "5e28c5f9-d711-4cd6-ac15-d13d71abff89",
      name: "Test User",
      email: "testuser@gmail.com",
      password_hash:
        "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
      roles: JSON.stringify(["user"]),
    },
    {
      id: "5e28c5f9-d711-4cd6-ac15-d13d71abff90",
      name: "Test User2",
      email: "testuser2@gmail.com",
      password_hash:
        "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
      roles: JSON.stringify(["user"]),
    },
  ],
};

const dataToDelete = {
  orders: [
    "ebda9b24-4e97-4229-a419-efd1dea56e01",
    "7f28c5f9-abcd-4cd6-ac15-d13d71abff85",
  ],
  types: ["7f28c5f9-d711-4cd6-ac15-d13d71abff89"],
  users: [
    "5e28c5f9-d711-4cd6-ac15-d13d71abff89",
    "5e28c5f9-d711-4cd6-ac15-d13d71abff90",
  ],
};

describe("Orders", () => {
  let request;
  let knex;
  let loginHeader;

  withServer(({ request: r, knex: k }) => {
    request = r;
    knex = k;
  });

  beforeAll(async () => {
    loginHeader = await loginAdmin(request);
  });

  const url = "/api/orders";

  describe("GET /api/orders", () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.type).insert(data.types);
      await knex(tables.order).insert(data.orders);
    });

    afterAll(async () => {
      await knex(tables.order).whereIn("id", dataToDelete.orders).delete();
      await knex(tables.type).whereIn("id", dataToDelete.types).delete();
      await knex(tables.user).whereIn("id", dataToDelete.users).delete();
    });

    it("should 200 and return all orders", async () => {
      const response = await request.get(url).set("Authorization", loginHeader);
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(100);
      expect(response.body.offset).toBe(0);
      expect(response.body.data.length).toBe(2);
    });
  });

  describe("GET /api/orders/:id", () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.type).insert(data.types);
      await knex(tables.order).insert(data.orders[0]);
    });

    afterAll(async () => {
      await knex(tables.order).where("id", dataToDelete.orders[0]).delete();
      await knex(tables.type).whereIn("id", dataToDelete.types).delete();
      await knex(tables.user).whereIn("id", dataToDelete.users).delete();
    });

    it("should 200 and return the requested order", async () => {
      const orderId = data.orders[0].id;
      const response = await request
        .get(`${url}/${orderId}`)
        .set("Authorization", loginHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: orderId,
        user: {
          id: "5e28c5f9-d711-4cd6-ac15-d13d71abff89",
          name: "Test User",
          email: "testuser@gmail.com",
          password_hash:
            "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
          roels: ["user"],
        },
        items: [
          {
            id: "7f28c5f9-d711-5555-ac15-d13d71abff84",
            title: "item1",
            imagesrc: "/images/Afb3.jpg",
            type_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff89",
            description: "Dit is een eerste voorbeeld",
            price: 9.99,
          },
          {
            id: "7f28c5f9-d711-5555-ac15-d13d71abff85",
            title: "item2",
            imagesrc: "/images/Afb3.jpg",
            type_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff89",
            description: "Dit is een tweede voorbeeld",
            price: 19.99,
          },
        ],
      });
    });
  });

  describe("GET /api/orders/user/:id", () => {
    beforeAll(async () => {
      await knex(tables.type).insert(data.types);
      await knex(tables.user).insert(data.users);
      await knex(tables.order).insert(data.orders);
    });

    afterAll(async () => {
      await knex(tables.order).whereIn("id", dataToDelete.orders).delete();
      await knex(tables.type).whereIn("id", dataToDelete.types).delete();
      await knex(tables.user).whereIn("id", dataToDelete.users).delete();
    });

    it("should return 200 and the order of the user", async () => {
      const userId = data.users[0].id;
      const response = await request
        .get(`${url}/user/${userId}`)
        .set("Authorization", loginHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: "ebda9b24-4e97-4229-a419-efd1dea56e01",
          user: {
            email: "testuser@gmail.com",
            id: "5e28c5f9-d711-4cd6-ac15-d13d71abff89",
            name: "Test User",
            password_hash:
              "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
            roels: ["user"],
          },
          items: [
            {
              id: "7f28c5f9-d711-5555-ac15-d13d71abff84",
              title: "item1",
              imagesrc: "/images/Afb3.jpg",
              type_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff89",
              description: "Dit is een eerste voorbeeld",
              price: 9.99,
            },
            {
              id: "7f28c5f9-d711-5555-ac15-d13d71abff85",
              title: "item2",
              imagesrc: "/images/Afb3.jpg",
              type_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff89",
              description: "Dit is een tweede voorbeeld",
              price: 19.99,
            },
          ],
        },
      ]);
    });
  });

  describe("POST /api/orders", () => {
    const ordersToDelete = [];
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.type).insert(data.types);
    });

    afterAll(async () => {
      await knex(tables.order).whereIn("id", ordersToDelete).delete();
      await knex(tables.type).whereIn("id", dataToDelete.types).delete();
      await knex(tables.user).whereIn("id", dataToDelete.users).delete();
    });

    it("should 201 and return the created order", async () => {
      const response = await request
        .post(url)
        .set("Authorization", loginHeader)
        .send({
          userId: "5e28c5f9-d711-4cd6-ac15-d13d71abff89",
          items: JSON.stringify([
            {
              id: "7f28c5f9-d711-5555-ac15-d13d71abfd85",
              title: "item2",
              imagesrc: "/images/Afb3.jpg",
              type_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff89",
              description: "Dit is een tweede voorbeeld",
              price: 19.99,
            },
          ]),
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.items.length).toBe(1);
      expect(response.body.user).toEqual({
        id: "5e28c5f9-d711-4cd6-ac15-d13d71abff89",
        name: "Test User",
        email: "testuser@gmail.com",
        password_hash:
          "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
        roels: ["user"],
      });

      ordersToDelete.push(response.body.id);
    });
  });

  describe("DELETE api/orders/:id", () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.type).insert(data.types);
      await knex(tables.order).insert([
        {
          id: "00a6f199-a886-4fd3-a4d3-02e13aad8679",
          user_id: "5e28c5f9-d711-4cd6-ac15-d13d71abff89",
          items: JSON.stringify([
            {
              id: "7f28c5f9-d711-5555-ac15-d13d71abdf84",
              title: "item1",
              imagesrc: "/images/Afb3.jpg",
              type_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff89",
              description: "Dit is een eerste voorbeeld",
              price: 9.99,
            },
            {
              id: "7f28c5f9-d711-5555-ac15-d13d71abdf85",
              title: "item2",
              imagesrc: "/images/Afb3.jpg",
              type_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff89",
              description: "Dit is een tweede voorbeeld",
              price: 19.99,
            },
          ]),
        },
      ]);
    });

    afterAll(async () => {
      await knex(tables.type).whereIn("id", dataToDelete.types).delete();
      await knex(tables.user).whereIn("id", dataToDelete.users).delete();
    });

    it("should 204 and return nothing", async () => {
      const response = await request
        .delete(`${url}/00a6f199-a886-4fd3-a4d3-02e13aad8679`)
        .set("Authorization", loginHeader);
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });

  describe("PUT /api/orders/:id", () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.type).insert(data.types);
      await knex(tables.order).insert([
        {
          id: "146c02c1-489b-4a97-8d92-f86116eb8365",
          user_id: "5e28c5f9-d711-4cd6-ac15-d13d71abff89",
          items: JSON.stringify([
            {
              id: "7f28c5f9-d711-4cd6-ac15-d13d71abff84",
              title: "item1",
              imagesrc: "/images/Afb3.jpg",
              type_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff89",
              description: "Dit is een eerste voorbeeld",
              price: 9.99,
            },
            {
              id: "7f28c5f9-d711-4cd6-ac15-d13d71abff85",
              title: "item2",
              imagesrc: "/images/Afb3.jpg",
              type_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff89",
              description: "Dit is een tweede voorbeeld",
              price: 19.99,
            },
          ]),
        },
      ]);
    });

    afterAll(async () => {
      await knex(tables.order)
        .where("id", "146c02c1-489b-4a97-8d92-f86116eb8365")
        .delete();

      await knex(tables.type).whereIn("id", dataToDelete.types).delete();
      await knex(tables.user).whereIn("id", dataToDelete.users).delete();
    });

    it("should 200 and return the updated order", async () => {
      const response = await request
        .put(`${url}/146c02c1-489b-4a97-8d92-f86116eb8365`)
        .set("Authorization", loginHeader)
        .send({
          userId: "5e28c5f9-d711-4cd6-ac15-d13d71abff89",
          items: JSON.stringify([
            {
              id: "7f28c5f9-d711-4cd6-ac15-d13d71abff84",
              title: "item1",
              imagesrc: "/images/Afb3.jpg",
              type_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff89",
              description: "Updated",
              price: 9.99,
            },
          ]),
        });
      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.items[0].description).toBe("Updated");
    });
  });
});
