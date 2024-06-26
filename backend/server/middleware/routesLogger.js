/* eslint no-undef: "error" */
/* eslint-env node */

const morgan = require('morgan')
const logger = require('./logger')

const format = ':remote-addr - :request-id :status :method :url - :total-time'

morgan.token('request-id', (req) => req.id)

module.exports = function setLogger(app) {
  app.use(morgan(format, { stream: logger.stream }))
}
