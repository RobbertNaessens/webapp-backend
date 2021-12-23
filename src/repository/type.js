const uuid = require("uuid");
const { tables, getKnex } = require("../data");
const { getChildLogger } = require("../core/logging");

/**
 * Get all `limit` types, skip the first `offset`.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of types to return.
 * @param {number} pagination.offset - Nr of types to skip.
 */
const findAll = ({ limit, offset }) => {
  return getKnex()(tables.type)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy("title", "ASC");
};

/**
 * Calculate the total number of types.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.type).count();
  return count["count(*)"];
};

/**
 * Find a type with the given id.
 *
 * @param {string} id - The id to search for.
 */
const findById = (id) => {
  return getKnex()(tables.type).where("id", id).first();
};

/**
 * Create a new type with the given `title`.
 *
 * @param {object} type - Type to create.
 * @param {string} [type.title] - Title of the type.
 */
const create = async ({ title }) => {
  try {
    const id = uuid.v4();
    await getKnex()(tables.type).insert({
      id,
      title,
    });
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger("users-repo");
    logger.error("Error in create", {
      error,
    });
    throw error;
  }
};

/**
 * Update a type with the given `id`.
 *
 * @param {string} id - Id of the type to update.
 * @param {object} type - type to save.
 * @param {string} [type.title] - Title of the type.
 */
const updateById = async (id, { title }) => {
  try {
    await getKnex()(tables.type)
      .update({
        title,
      })
      .where("id", id);
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger("users-repo");
    logger.error("Error in updateById", {
      error,
    });
    throw error;
  }
};

/**
 * Delete a type with the given `id`.
 *
 * @param {string} id - Id of the type to delete.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.type).delete().where("id", id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger("users-repo");
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
  create,
  updateById,
  deleteById,
};
