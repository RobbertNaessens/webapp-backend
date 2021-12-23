const config = require("config");
const { getChildLogger } = require("../core/logging");
const ServiceError = require("../core/serviceError");
const orderRepository = require("../repository/order");

const DEFAULT_PAGINATION_LIMIT = config.get("pagination.limit");
const DEFAULT_PAGINATION_OFFSET = config.get("pagination.offset");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger("item-service");
  this.logger.debug(message, meta);
};

/**
 * Get all `limit` orders, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of orders to fetch.
 * @param {number} [offset] - Nr of orders to skip.
 */
const getAll = async (
  limit = DEFAULT_PAGINATION_LIMIT,
  offset = DEFAULT_PAGINATION_OFFSET
) => {
  debugLog("Fetching all orders", { limit, offset });
  const data = await orderRepository.findAll({ limit, offset });
  const count = await orderRepository.findCount();
  return {
    data,
    count,
    limit,
    offset,
  };
};

/**
 * Get the order with the given `id`.
 *
 * @param {number} id - Id of the item to find.
 */
const getById = async (id) => {
  debugLog(`Fetching order with id ${id}`);
  const order = await orderRepository.findById(id);

  if (!order) {
    throw ServiceError.notFound(`There is no order with id ${id}`, { id });
  }

  return order;
};

/**
 * Get the order with the given `userId`.
 *
 * @param {number} id - Id of the user to find.
 */
const getByUserId = async (id) => {
  debugLog(`Fetching order(s) from user with id ${id}`);
  const order = await orderRepository.findByUserId(id);

  if (!order) {
    throw ServiceError.notFound(`User ${id} has no order(s)`, { id });
  }

  return order;
};

/**
 * Create a new order.
 *
 * @param {object} order - The item to create.
 * @param {string} [order.items] - The items in the order.
 * @param {string} [order.userId] - Id of the user.
 */
const create = async ({ userId, items }) => {
  debugLog("Creating new order", {
    userId,
    items,
  });

  return orderRepository.create({
    userId,
    items,
  });
};

/**
 * Update an existing order.
 *
 * @param {object} order - The item to create.
 * @param {string} [order.items] - The items in the order.
 * @param {string} [order.userId] - Id of the user.
 */
const updateById = async (id, { userId, items }) => {
  debugLog(`Updating order with id ${id}`, {
    userId,
    items,
  });

  return orderRepository.updateById(id, {
    userId,
    items,
  });
};

/**
 * Delete the order with the given `id`.
 *
 * @param {number} id - Id of the order to delete.
 */
const deleteById = async (id) => {
  debugLog(`Deleting order with id ${id}`);
  await orderRepository.deleteById(id);
};

module.exports = {
  getById,
  getAll,
  getByUserId,
  create,
  updateById,
  deleteById,
};
