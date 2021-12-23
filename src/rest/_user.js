const Router = require("@koa/router");
const userService = require("../service/user");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Role = require("../core/roles");
const Joi = require("joi");
const validate = require("./_validation");

const getAllUsers = async (ctx) => {
  const users = await userService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset)
  );
  ctx.body = users;
};
getAllUsers.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().integer().max(1000).optional(),
    offset: Joi.number().positive().integer().optional(),
  }).and("limit", "offset"),
};

const getUserById = async (ctx) => {
  const user = await userService.getById(ctx.params.id);
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const updateUserById = async (ctx) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body);
  ctx.body = user;
};
updateUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
  },
};

const deleteUserById = async (ctx) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const login = async (ctx) => {
  const { email, password } = ctx.request.body;
  const session = await userService.login(email, password);
  ctx.body = session;
};
login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

const register = async (ctx) => {
  const session = await userService.register(ctx.request.body);
  ctx.body = session;
};
register.validationScheme = {
  body: {
    name: Joi.string()
      .max(255)
      .pattern(new RegExp(/[a-zA-Z]+( [a-zA-Z]*)*/)),
    email: Joi.string().email(),
    password: Joi.string().max(30),
  },
};

const requireAdmin = makeRequireRole(Role.ADMIN);

/**
 * Install user routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installUsersRoutes(app) {
  const router = new Router({
    prefix: "/users",
  });
  //
  router.get(
    "/",
    requireAuthentication,
    validate(getAllUsers.validationScheme),
    getAllUsers
  );
  router.get(
    "/:id",
    requireAuthentication,
    validate(getUserById.validationScheme),
    getUserById
  );
  router.put(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(updateUserById.validationScheme),
    updateUserById
  );
  router.delete(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(deleteUserById.validationScheme),
    deleteUserById
  );

  router.post("/login", validate(login.validationScheme), login);
  router.post("/register", validate(register.validationScheme), register);

  app.use(router.routes()).use(router.allowedMethods());
};
