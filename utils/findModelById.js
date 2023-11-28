const { ErrorResponse } = require("./errorResponse");

/**
 * @param {import("mongoose").Model} Model
 * @param {import("mongoose").ObjectId} id
 */
const findResourceById = async (Model, id) => {
  const resource = await Model.findById(id);

  if (!resource) {
    throw new ErrorResponse(`Resource not found with id of ${id}`, 404);
  }

  return resource;
};

module.exports = { findResourceById };
