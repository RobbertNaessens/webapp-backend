const Router = require("@koa/router");
const typeService = require("../service/type");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Role = require("../core/roles");
const Joi = require("joi");
const validate = require("./_validation");

const getAllTypes = async (ctx) => {
  ctx.body = await typeService.getAll();
};
getAllTypes.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().integer().max(1000).optional(),
    offset: Joi.number().positive().integer().optional(),
  }).and("limit", "offset"),
};

const createType = async (ctx) => {
  const newPlace = await typeService.create(ctx.request.body);
  ctx.body = newPlace;
};
createType.validationScheme = {
  body: {
    title: Joi.string()
      .max(100)
      .pattern(new RegExp(/[a-zA-Z]+( +[a-zA-Z]*)*/)),
  },
};

const getTypeById = async (ctx) => {
  ctx.body = await typeService.getById(ctx.params.id);
};
getTypeById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const updateType = async (ctx) => {
  ctx.body = await typeService.updateById(ctx.params.id, ctx.request.body);
};
updateType.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    id: Joi.string().uuid(),
    title: Joi.string()
      .max(100)
      .pattern(new RegExp(/[a-zA-Z]+( +[a-zA-Z]*)*/)),
  },
};

const deleteType = async (ctx) => {
  await typeService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteType.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const requireAdmin = makeRequireRole(Role.ADMIN);

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: "/types",
  });

  router.get("/", validate(getAllTypes.validationScheme), getAllTypes);
  router.post(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(createType.validationScheme),
    createType
  );
  router.get("/:id", validate(getTypeById.validationScheme), getTypeById);
  router.put(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(updateType.validationScheme),
    updateType
  );
  router.delete(
    "/:id",
    requireAuthentication,
    validate(deleteType.validationScheme),
    requireAdmin,
    deleteType
  );

  app.use(router.routes()).use(router.allowedMethods());
};
