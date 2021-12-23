const Router = require("@koa/router");
const orderService = require("../service/order");
const { requireAuthentication } = require("../core/auth");
const Joi = require("joi");
const validate = require("./_validation");

const getAllOrders = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await orderService.getAll(limit, offset);
};
getAllOrders.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().integer().max(1000).optional(),
    offset: Joi.number().positive().integer().optional(),
  }).and("limit", "offset"),
};

const getOrderById = async (ctx) => {
  ctx.body = await orderService.getById(ctx.params.id);
};
getOrderById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const getOrderByUserId = async (ctx) => {
  ctx.body = await orderService.getByUserId(ctx.params.id);
};
getOrderByUserId.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const updateOrder = async (ctx) => {
  ctx.body = await orderService.updateById(ctx.params.id, {
    ...ctx.request.body,
  });
};
updateOrder.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    items: Joi.string(),
    userId: Joi.string().uuid(),
  },
};

const createOrder = async (ctx) => {
  const newOrder = await orderService.create({
    ...ctx.request.body,
  });
  ctx.body = newOrder;
  ctx.status = 201;
};
createOrder.validationScheme = {
  body: {
    userId: Joi.string().uuid(),
    items: Joi.string(),
  },
};

const deleteOrder = async (ctx) => {
  await orderService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteOrder.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

/**
 * Install order routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: "/orders",
  });

  router.post(
    "/",
    requireAuthentication,
    validate(createOrder.validationScheme),
    createOrder
  );
  router.get(
    "/",
    requireAuthentication,
    validate(getAllOrders.validationScheme),
    getAllOrders
  );
  router.get(
    "/:id",
    requireAuthentication,
    validate(getOrderById.validationScheme),
    getOrderById
  );
  router.get(
    "/user/:id",
    requireAuthentication,
    validate(getOrderByUserId.validationScheme),
    getOrderByUserId
  );
  router.put(
    "/:id",
    requireAuthentication,
    validate(updateOrder.validationScheme),
    updateOrder
  );
  router.delete(
    "/:id",
    requireAuthentication,
    validate(deleteOrder.validationScheme),
    deleteOrder
  );

  app.use(router.routes()).use(router.allowedMethods());
};
