const uuid = require("uuid");
const { tables, getKnex } = require("../data");
const { getChildLogger } = require("../core/logging");

const SELECT_COLUMNS = [
  `${tables.order}.id`,
  `${tables.user}.id as user_id`,
  `${tables.user}.name as user_name`,
  `${tables.user}.email as user_email`,
  `${tables.user}.password_hash as user_password_hash`,
  `${tables.user}.roles as user_roles`,
  `${tables.order}.items`,
];

const formatOrder = ({
  user_id,
  user_name,
  user_email,
  user_password_hash,
  user_roles,
  ...rest
}) => ({
  ...rest,
  user: {
    id: user_id,
    name: user_name,
    email: user_email,
    password_hash: user_password_hash,
    roels: user_roles,
  },
});

/**
 * Get all `limit` orders, throws on error.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of orders to return.
 * @param {number} pagination.offset - Nr of orders to skip.
 */
const findAll = async ({ limit, offset }) => {
  const orders = await getKnex()(tables.order)
    .select(SELECT_COLUMNS)
    .join(tables.user, `${tables.order}.user_id`, "=", `${tables.user}.id`)
    .limit(limit)
    .offset(offset);

  return orders.map(formatOrder);
};

/**
 * Calculate the total number of orders.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.order).count();

  return count["count(*)"];
};

/**
 * Find an order with the given `id`.
 *
 * @param {string} id - Id of the order to find.
 */
const findById = async (id) => {
  const order = await getKnex()(tables.order)
    .first(SELECT_COLUMNS)
    .where(`${tables.order}.id`, id)
    .join(tables.user, `${tables.order}.user_id`, "=", `${tables.user}.id`);

  return order && formatOrder(order);
};

/**
 * Find an order with the given `userId`.
 *
 * @param {string} id - Id of the user to find.
 */
const findByUserId = async (id) => {
  const order = await getKnex()(tables.order)
    .select(SELECT_COLUMNS)
    .where(`${tables.order}.user_id`, id)
    .join(tables.user, `${tables.order}.user_id`, "=", `${tables.user}.id`);

  return order && order.map(formatOrder);
};

/**
 * Create a new order.
 *
 * @param {object} order - The item to create.
 * @param {string} [order.userId] - Id of the user.
 * @param {object} [order.items] - Items in the order.
 *
 * @returns {Promise<object>} Created order
 */
const create = async ({ userId, items }) => {
  try {
    const id = uuid.v4();
    await getKnex()(tables.order).insert({
      id,
      user_id: userId,
      items,
    });
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger("transactions-repo");
    logger.error("Error in create", {
      error,
    });
    throw error;
  }
};

/**
 * Update an existing order.
 *
 * @param {object} order - The order to create.
 * @param {string} [order.userId] - Id of the user.
 * @param {object} [order.items] - Items in the order.
 *
 * @returns {Promise<object>} Updated order
 */
const updateById = async (id, { userId, items }) => {
  try {
    await getKnex()(tables.order)
      .update({
        id,
        user_id: userId,
        items,
      })
      .where(`${tables.order}.id`, id);
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger("transactions-repo");
    logger.error("Error in updateById", {
      error,
    });
    throw error;
  }
};

/**
 * Delete an order with the given `id`.
 *
 * @param {string} id - Id of the item to delete.
 *
 * @returns {Promise<boolean>} Whether the order was deleted.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.order)
      .delete()
      .where(`${tables.order}.id`, id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger("transactions-repo");
    logger.error("Error in deleteById", {
      error,
    });
    throw error;
  }
};

module.exports = {
  findById,
  findAll,
  findByUserId,
  create,
  updateById,
  deleteById,
  findCount,
};
