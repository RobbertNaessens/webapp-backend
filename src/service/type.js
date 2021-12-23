const config = require("config");
const { getChildLogger } = require("../core/logging");
const typeRepository = require("../repository/type");

const DEFAULT_PAGINATION_LIMIT = config.get("pagination.limit");
const DEFAULT_PAGINATION_OFFSET = config.get("pagination.offset");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger("type-service");
  this.logger.debug(message, meta);
};

/**
 * Get all `limit` types, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of types to fetch.
 * @param {number} [offset] - Nr of types to skip.
 */
const getAll = async (
  limit = DEFAULT_PAGINATION_LIMIT,
  offset = DEFAULT_PAGINATION_OFFSET
) => {
  debugLog("Fetching all types", { limit, offset });
  const data = await typeRepository.findAll({ limit, offset });
  const count = await typeRepository.findCount();
  return { data, count };
};

/**
 * Get the type with the given `id`.
 *
 * @param {string} id - Id of the type to get.
 */
const getById = (id) => {
  debugLog(`Fetching type with id ${id}`);
  return typeRepository.findById(id);
};

/**
 * Create a new type.
 *
 * @param {object} type - Type to create.
 * @param {string} [type.title] - Title of the type.
 */
const create = ({ title }) => {
  const newType = { title };
  debugLog("Creating new type", newType);
  return typeRepository.create(newType);
};

/**
 * Update an existing type.
 *
 * @param {string} id - Id of the type to update.
 * @param {object} type - type to save.
 * @param {string} [type.title] - Title of the type.
 */
const updateById = (id, { title }) => {
  const updatedType = { title };
  debugLog(`Updating type with id ${id}`, updatedType);
  return typeRepository.updateById(id, updatedType);
};

/**
 * Delete an existing type.
 *
 * @param {string} id - Id of the type to delete.
 */
const deleteById = async (id) => {
  debugLog(`Deleting type with id ${id}`);
  await typeRepository.deleteById(id);
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
