/**
 * @desc Get all bootcamps
 * @route /api/v1/bootcamps
 * @access Public
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.getBootcamps = (req, res, next) => {};

/**
 * @desc Get one bootcamp
 * @route /api/v1/bootcamps/:id
 * @access Public
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.getBootcamp = (req, res, next) => {};

/**
 * @desc Create new bootcamp
 * @route /api/v1/bootcamps
 * @access Private
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.postBootcamp = (req, res, next) => {};

/**
 * @desc Update  bootcamp
 * @route /api/v1/bootcamps/:id
 * @access Private
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.patchBootcamp = (req, res, next) => {};

/**
 * @desc Delete bootcamp
 * @route /api/v1/bootcamps/:id
 * @access Private
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.deleteBootcamp = (req, res, next) => {};
