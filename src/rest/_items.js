const Router = require("@koa/router");
const itemService = require("../service/item");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Role = require("../core/roles");
const Joi = require("joi");
const validate = require("./_validation");

const getAllItems = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await itemService.getAll(limit, offset);
};
getAllItems.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().integer().max(1000).optional(),
    offset: Joi.number().positive().integer().optional(),
  }).and("limit", "offset"),
};

const createItem = async (ctx) => {
  const newItem = await itemService.create({
    ...ctx.request.body,
  });
  ctx.body = newItem;
  ctx.status = 201;
};
createItem.validationScheme = {
  body: {
    title: Joi.string().max(100),
    imagesrc: Joi.string(),
    typeId: Joi.string().uuid(),
    description: Joi.string().allow("").optional(),
    price: Joi.number().positive().max(1000),
  },
};

const getItemById = async (ctx) => {
  ctx.body = await itemService.getById(ctx.params.id);
};
getItemById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const getItemsByType = async (ctx) => {
  ctx.body = await itemService.getItemsByType(ctx.params.typetitle);
};
getItemsByType.validationScheme = {
  params: {
    typetitle: Joi.string(),
  },
};

const updateItem = async (ctx) => {
  ctx.body = await itemService.updateById(ctx.params.id, {
    ...ctx.request.body,
  });
};
updateItem.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    title: Joi.string()
      .max(100)
      .pattern(new RegExp(/[a-zA-Z]+( [a-zA-Z]*)*/)),
    type_id: Joi.string().uuid(),
    imagesrc: Joi.string(),
    description: Joi.string().allow("").optional(),
    price: Joi.number().positive().max(1000),
  },
};

const deleteItem = async (ctx) => {
  await itemService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteItem.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const requireAdmin = makeRequireRole(Role.ADMIN);

/**
 * Install item routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: "/items",
  });

  router.get(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(getAllItems.validationScheme),
    getAllItems
  );
  router.post(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(createItem.validationScheme),
    createItem
  );
  router.get(
    "/:id",
    requireAuthentication,
    validate(getItemById.validationScheme),
    getItemById
  );
  router.get(
    "/type/:typetitle",
    validate(getItemsByType.validationScheme),
    getItemsByType
  );
  router.put(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(updateItem.validationScheme),
    updateItem
  );
  router.delete(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(deleteItem.validationScheme),
    deleteItem
  );

  app.use(router.routes()).use(router.allowedMethods());
};
