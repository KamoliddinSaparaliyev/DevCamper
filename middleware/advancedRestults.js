const asyncHandler = require("express-async-handler");

/**
 * @param {import("mongoose").Model} model
 */
const advancedResults = (model, populate) =>
  asyncHandler(async (req, res, next) => {
    const reqQuery = { ...req.query };

    // Extract fields to remove from query
    const removeFields = ["select", "sort", "page", "limit", "q", "all"];

    // Remove fields from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Convert query object to string to manipulate
    let queryStr = JSON.stringify(reqQuery);

    // Add MongoDB operators ($gt, $gte, etc.) to query string
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Parse the modified query string back to an object
    let query = model.find(JSON.parse(queryStr));

    if (req.query.q) {
      const searchValue = req.query.q;

      const modelFields = Object.keys(model.schema.paths);

      const orConditions = modelFields
        .map((field) => {
          const fieldType = model.schema.paths[field].instance;
          if (fieldType === "String") {
            const searchRegex = new RegExp(searchValue, "i");
            return { [field]: { $regex: searchRegex } };
          } else if (fieldType === "Number" && !isNaN(searchValue)) {
            // If the field type is a number and the query is a valid number
            return { [field]: searchValue };
          } else if (fieldType === "Date" && !isNaN(Date.parse(searchValue))) {
            // If the field type is a date and the query is a valid date
            return { [field]: new Date(searchValue) };
          } else if (fieldType === "ObjectId" && searchValue.length === 24) {
            // If the field type is a number and the query is a valid number
            return { [field]: searchValue };
          } else {
            return null; // Exclude fields of unsupported types or invalid queries
          }
        })
        .filter((condition) => condition !== null); // Filter out null conditions

      if (req.query.select) {
        const selectFields = req.query.select
          .split(",")
          .filter((field) => field !== ""); // Split select fields and remove empty strings
        // Include select fields if they are not already included
        if (!selectFields.includes("__v")) {
          selectFields.push("__v");
        }

        query = query
          .find({ $or: orConditions })
          .select(selectFields.join(" "));
      }

      query = query.find({ $or: orConditions });
    }

    // Select specific fields if specified in query
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Return all data
    if (req.query.all === "true") {
      if (populate) {
        query = query.populate(populate);
      }

      const data = await query;

      if (data.length === 0) {
        return res.status(204).send({
          success: true,
          message: `${model.modelName} list`,
          data,
        });
      }

      return res.send({
        success: true,
        message: `${model.modelName} list`,
        total: data.length,
        data,
      });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.find(query).countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Populate
    if (populate) {
      query = query.populate(populate);
    }

    // Execute the query
    const data = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    if (data.length === 0) {
      return res.status(204).send({
        success: true,
        message: `${model.modelName} list`,
        data,
      });
    }

    return res.send({
      success: true,
      message: `${model.modelName} list`,
      count: data.length,
      total,
      data,
      pagination,
    });
  });

module.exports = { advancedResults };
