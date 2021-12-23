const uuid = require("uuid");
const { tables, getKnex } = require("../data/index");
const { getChildLogger } = require("../core/logging");

const SELECT_COLUMNS = [
  `${tables.item}.id`,
  `${tables.item}.title`,
  "imagesrc",
  `${tables.type}.id as type_id`,
  `${tables.type}.title as type_title`,
  "description",
  "price",
];

const formatItem = ({ type_id, type_title, ...rest }) => ({
  ...rest,
  type: {
    id: type_id,
    title: type_title,
  },
});

/**
 * Get all `limit` items, throws on error.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of items to return.
 * @param {number} pagination.offset - Nr of items to skip.
 */
const findAll = async ({ limit, offset }) => {
  const items = await getKnex()(tables.item)
    .select(SELECT_COLUMNS)
    .join(tables.type, `${tables.item}.type_id`, "=", `${tables.type}.id`)
    .limit(limit)
    .offset(offset)
    .orderBy(`${tables.item}.title`, "ASC");

  return items.map(formatItem);
};

/**
 * Calculate the total number of items.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.item).count();

  return count["count(*)"];
};

/**
 * Find an item with the given `id`.
 *
 * @param {string} id - Id of the item to find.
 */
const findById = async (id) => {
  const item = await getKnex()(tables.item)
    .first(SELECT_COLUMNS)
    .where(`${tables.item}.id`, id)
    .join(tables.type, `${tables.item}.type_id`, "=", `${tables.type}.id`);

  return item && formatItem(item);
};

/**
 * Find items with the given `type.title`.
 *
 * @param {string} typetitle - Title of the type
 *
 */
const findByType = async (typetitle) => {
  const items = await getKnex()(tables.item)
    .select(SELECT_COLUMNS)
    .join(tables.type, `${tables.item}.type_id`, "=", `${tables.type}.id`)
    .where(`${tables.type}.title`, typetitle)
    .orderBy(`${tables.item}.title`, "ASC");

  return items && items.map(formatItem);
};

/**
 * Create a new item.
 *
 * @param {object} item - The item to create.
 * @param {string} [item.title] - Title.
 * @param {string} [item.imagesrc] - Imagesrc.
 * @param {string} [item.typeId] - Id of the type.
 * @param {string} [item.description] - Description of the item.
 * @param {string} [item.price] - Price of the item.
 *
 * @returns {Promise<object>} Created item
 */
const create = async ({ title, imagesrc, typeId, description, price }) => {
  try {
    const id = uuid.v4();
    await getKnex()(tables.item).insert({
      id,
      title,
      imagesrc,
      type_id: typeId,
      description,
      price,
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
 * Update an existing item.
 *
 * @param {object} item - The item to create.
 * @param {string} [item.title] - Title.
 * @param {string} [item.imagesrc] - Imagesrc.
 * @param {string} [item.typeId] - Id of the type.
 * @param {string} [item.description] - Description of the item.
 * @param {string} [item.price] - Price of the item.
 *
 * @returns {Promise<object>} Updated item
 */
const updateById = async (id, { title, imagesrc, typeId, description, price }) => {
  try {
    await getKnex()(tables.item)
      .update({
        id,
        title,
        imagesrc,
        type_id: typeId,
        description,
        price,
      })
      .where(`${tables.item}.id`, id);
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
 * Delete an item with the given `id`.
 *
 * @param {string} id - Id of the item to delete.
 *
 * @returns {Promise<boolean>} Whether the item was deleted.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.item)
      .delete()
      .where(`${tables.item}.id`, id);
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
  findAll,
  findCount,
  findById,
  findByType,
  create,
  updateById,
  deleteById,
};
