const { tables } = require("../../src/data");
const { withServer, loginAdmin } = require("../supertest.setup");

const data = {
  items: [
    {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abff84",
      title: "item1",
      imagesrc: "/images/Afb3.jpg",
      type_id: "6f28c5f9-d711-4cd6-ac15-d13d71abff89",
      description: "Dit is een eerste voorbeeld",
      price: 9.99,
    },
    {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abff85",
      title: "item2",
      imagesrc: "/images/Afb3.jpg",
      type_id: "6f28c5f9-d711-4cd6-ac15-d13d71abff89",
      description: "Dit is een tweede voorbeeld",
      price: 19.99,
    },
    {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abff86",
      title: "item3",
      imagesrc: "/images/Afb4.jpg",
      type_id: "6f28c5f9-d711-4cd6-ac15-d13d71abff89",
      description: "Dit is een derde voorbeeld",
      price: 14.99,
    },
    {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abff90",
      title: "item4",
      imagesrc: "/images/Afb3.jpg",
      type_id: "6f28c5f9-d711-4cd6-ac15-d13d71abff93",
      description: "Dit is een vierde voorbeeld",
      price: 8.99,
    },
  ],
  types: [
    {
      id: "6f28c5f9-d711-4cd6-ac15-d13d71abff89",
      title: "Sleutelhanger",
    },
    {
      id: "6f28c5f9-d711-4cd6-ac15-d13d71abff93",
      title: "Gekochte beelden",
    },
  ],
};

const dataToDelete = {
  items: [
    "7f28c5f9-d711-4cd6-ac15-d13d71abff84",
    "7f28c5f9-d711-4cd6-ac15-d13d71abff85",
    "7f28c5f9-d711-4cd6-ac15-d13d71abff86",
    "7f28c5f9-d711-4cd6-ac15-d13d71abff90",
  ],
  types: [
    "6f28c5f9-d711-4cd6-ac15-d13d71abff89",
    "6f28c5f9-d711-4cd6-ac15-d13d71abff93",
  ],
};

describe("Items", () => {
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

  const url = "/api/items";

  describe("GET /api/items", () => {
    beforeAll(async () => {
      await knex(tables.type).insert(data.types);
      await knex(tables.item).insert(data.items);
    });

    afterAll(async () => {
      await knex(tables.item).whereIn("id", dataToDelete.items).delete();

      await knex(tables.type).whereIn("id", dataToDelete.types).delete();
    });

    it("should 200 and return all items", async () => {
      const response = await request.get(url).set("Authorization", loginHeader);
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(100);
      expect(response.body.offset).toBe(0);
      expect(response.body.data.length).toBe(4);
    });

    it("should 200 and paginate the list of items", async () => {
      const response = await request
        .get(`${url}?limit=2&offset=1`)
        .set("Authorization", loginHeader);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
      expect(response.body.data[0]).toEqual({
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abff85",
        title: "item2",
        imagesrc: "/images/Afb3.jpg",
        type: {
          id: "6f28c5f9-d711-4cd6-ac15-d13d71abff89",
          title: "Sleutelhanger",
        },
        description: "Dit is een tweede voorbeeld",
        price: "19.99",
      });
      expect(response.body.data[1]).toEqual({
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abff86",
        title: "item3",
        imagesrc: "/images/Afb4.jpg",
        type: {
          id: "6f28c5f9-d711-4cd6-ac15-d13d71abff89",
          title: "Sleutelhanger",
        },
        description: "Dit is een derde voorbeeld",
        price: "14.99",
      });
    });
  });

  describe("GET /api/items/:id", () => {
    beforeAll(async () => {
      await knex(tables.type).insert(data.types);
      await knex(tables.item).insert(data.items[0]);
    });

    afterAll(async () => {
      await knex(tables.item).where("id", dataToDelete.items[0]).delete();

      await knex(tables.type).whereIn("id", dataToDelete.types).delete();
    });

    it("should 200 and return the requested item", async () => {
      const itemId = data.items[0].id;
      const response = await request
        .get(`${url}/${itemId}`)
        .set("Authorization", loginHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: itemId,
        title: "item1",
        imagesrc: "/images/Afb3.jpg",
        type: {
          id: "6f28c5f9-d711-4cd6-ac15-d13d71abff89",
          title: "Sleutelhanger",
        },
        description: "Dit is een eerste voorbeeld",
        price: "9.99",
      });
    });
  });

  describe("POST /api/items", () => {
    const itemsToDelete = [];

    beforeAll(async () => {
      await knex(tables.type).insert(data.types);
    });

    afterAll(async () => {
      await knex(tables.item).whereIn("id", itemsToDelete).delete();

      await knex(tables.type).whereIn("id", dataToDelete.types).delete();
    });

    it("should 201 and return the created item", async () => {
      const response = await request
        .post(url)
        .set("Authorization", loginHeader)
        .send({
          title: "testItem",
          imagesrc: "/images/Afb3.jpg",
          typeId: "6f28c5f9-d711-4cd6-ac15-d13d71abff89",
          description: "Test description",
          price: "20.50",
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.price).toBe("20.50");
      expect(response.body.imagesrc).toBe("/images/Afb3.jpg");
      expect(response.body.description).toBe("Test description");
      expect(response.body.type).toEqual({
        id: "6f28c5f9-d711-4cd6-ac15-d13d71abff89",
        title: "Sleutelhanger",
      });

      itemsToDelete.push(response.body.id);
    });
  });

  describe("DELETE /api/transactions/:id", () => {
    beforeAll(async () => {
      await knex(tables.type).insert(data.types);

      await knex(tables.item).insert([
        {
          id: "7f28c5f9-d711-4cd6-ac15-d13d71abaa89",
          title: "testItem",
          imagesrc: "/images/Afb3.jpg",
          type_id: "6f28c5f9-d711-4cd6-ac15-d13d71abff89",
          description: "Test description",
          price: "20.50",
        },
      ]);
    });

    afterAll(async () => {
      await knex(tables.type).whereIn("id", dataToDelete.types).delete();
    });

    it("should 204 and return nothing", async () => {
      const response = await request
        .delete(`${url}/7f28c5f9-d711-4cd6-ac15-d13d71abaa89`)
        .set("Authorization", loginHeader);
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });

  describe("GET /api/items/type/:typetitle", () => {
    beforeAll(async () => {
      await knex(tables.type).insert(data.types);
      await knex(tables.item).insert(data.items[3]);
    });

    afterAll(async () => {
      await knex(tables.item).where("id", dataToDelete.items[3]).delete();

      await knex(tables.type).whereIn("id", dataToDelete.types).delete();
    });

    it("should 200 and return items of the given type", async () => {
      const typeTitle = data.types[1].title;
      const response = await request
        .get(`${url}/type/${typeTitle}`)
        .set("Authorization", loginHeader);

      expect(response.status).toBe(200);
      expect(response.body.data[0]).toEqual({
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abff90",
        title: "item4",
        imagesrc: "/images/Afb3.jpg",
        type: {
          id: "6f28c5f9-d711-4cd6-ac15-d13d71abff93",
          title: typeTitle,
        },
        description: "Dit is een vierde voorbeeld",
        price: "8.99",
      });
    });
  });
  describe("PUT /api/items/:id", () => {
    beforeAll(async () => {
      await knex(tables.type).insert(data.types);
      await knex(tables.item).insert([
        {
          id: "5f28c5f9-d711-4cd6-ac15-d13d71abff99",
          title: "PUT item",
          imagesrc: "/images/Afb3.jpg",
          type_id: "6f28c5f9-d711-4cd6-ac15-d13d71abff89",
          description: "Dit is een PUT voorbeeld",
          price: 9.99,
        },
      ]);
    });

    afterAll(async () => {
      await knex(tables.item)
        .where("id", "5f28c5f9-d711-4cd6-ac15-d13d71abff99")
        .delete();

      await knex(tables.type).whereIn("id", dataToDelete.types).delete();
    });

    it("should 200 and return the updated item", async () => {
      const response = await request
        .put(`${url}/5f28c5f9-d711-4cd6-ac15-d13d71abff99`)
        .set("Authorization", loginHeader)
        .send({
          title: "PUT item",
          imagesrc: "/images/Afb3.jpg",
          type_id: "6f28c5f9-d711-4cd6-ac15-d13d71abff89",
          description: "Dit is een PUT voorbeeld na update",
          price: 500.0,
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toBe("PUT item");
      expect(response.body.imagesrc).toBe("/images/Afb3.jpg");
      expect(response.body.type).toEqual({
        id: "6f28c5f9-d711-4cd6-ac15-d13d71abff89",
        title: "Sleutelhanger",
      });
      expect(response.body.description).toBe(
        "Dit is een PUT voorbeeld na update"
      );
      expect(response.body.price).toBe("500.00");
    });
  });
});
