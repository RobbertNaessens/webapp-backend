const config = require("config");
const { getChildLogger } = require("../core/logging");
const ServiceError = require("../core/serviceError");
const itemRepository = require("../repository/item");

const DEFAULT_PAGINATION_LIMIT = config.get("pagination.limit");
const DEFAULT_PAGINATION_OFFSET = config.get("pagination.offset");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger("item-service");
  this.logger.debug(message, meta);
};

/**
 * Get all `limit` items, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of items to fetch.
 * @param {number} [offset] - Nr of items to skip.
 */
const getAll = async (
  limit = DEFAULT_PAGINATION_LIMIT,
  offset = DEFAULT_PAGINATION_OFFSET
) => {
  debugLog("Fetching all items", { limit, offset });
  const data = await itemRepository.findAll({ limit, offset });
  const count = await itemRepository.findCount();
  return {
    data,
    count,
    limit,
    offset,
  };
};

/**
 * Get the item with the given `id`.
 *
 * @param {number} id - Id of the item to find.
 */
const getById = async (id) => {
  debugLog(`Fetching item with id ${id}`);
  const item = await itemRepository.findById(id);

  if (!item) {
    throw ServiceError.notFound(`There is no item with id ${id}`, { id });
  }

  return item;
};

/**
 * Get the items with the given `type`.
 *
 * @param {string} typetitle - Title of the type to find
 *
 */
const getItemsByType = async (typetitle) => {
  debugLog(`Fetching items with typetitle ${typetitle}`);
  const data = await itemRepository.findByType(typetitle);

  if (!data) {
    throw ServiceError.notFound(
      `There are no items found with type ${typetitle.toLowerCase()}`,
      { typetitle }
    );
  }

  return { data };
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
 */
const create = async ({ title, imagesrc, typeId, description, price }) => {
  debugLog("Creating new item", {
    title,
    imagesrc,
    typeId,
    description,
    price,
  });

  return itemRepository.create({
    title,
    imagesrc,
    typeId,
    description,
    price,
  });
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
 */
const updateById = async (
  id,
  { title, imagesrc, typeId, description, price }
) => {
  debugLog(`Updating item with id ${id}`, {
    title,
    imagesrc,
    typeId,
    description,
    price,
  });

  return itemRepository.updateById(id, {
    title,
    imagesrc,
    typeId,
    description,
    price,
  });
};

/**
 * Delete the item with the given `id`.
 *
 * @param {number} id - Id of the item to delete.
 */
const deleteById = async (id) => {
  debugLog(`Deleting item with id ${id}`);
  await itemRepository.deleteById(id);
};

module.exports = {
  getAll,
  getById,
  getItemsByType,
  create,
  updateById,
  deleteById,
};
