/* eslint no-undef: "error" */
/* eslint-env node */

const { ApiError } = require('../validators/errors/ApiError')
const logger = require('./logger')

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  logger.info(err.message)

  if (err instanceof ApiError) {
    return err.sendResponse(res)
  }

  return res.status(500).json({ message: err.message })
}
