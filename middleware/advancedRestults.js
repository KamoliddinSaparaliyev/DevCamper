const asyncHandler = require("express-async-handler");

const advancedResults = (model, populate) =>
  asyncHandler(async (req, res, next) => {
    const reqQuery = { ...req.query };

    // Extract fields to remove from query
    const removeFields = ["select", "sort", "page", "limit"];

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

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

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
    res.advancedResults = {
      success: true,
      count: data.length,
      total: total.length,
      data,
      pagination,
    };
    next();
  });

module.exports = { advancedResults };
