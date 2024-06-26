/* eslint no-undef: "error" */
/* eslint-env node */

const logger = require("../../middleware/logger");

function handleError(res, err) {
  console.trace();
  let message = '';
  if (err instanceof Error) message = err.message;
  else message = String(err);
  logger.error(message);
  return res.status(400).json({
    status: 'error',
    error: message,
  });
}

module.exports = {
  handleError,
};
