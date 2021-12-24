const Router = require("@koa/router");
const installItemRouter = require("./_items");
const installTypesRouter = require("./_types");
const installUserRouter = require("./_user");
const installOrderRouter = require("./_order");
const installHealthRoutes = require("./_health");

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: "/api",
  });

  installHealthRoutes(router);
  installItemRouter(router);
  installTypesRouter(router);
  installUserRouter(router);
  installOrderRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};
