/* eslint no-undef: "error" */
/* eslint-env node */

const winston = require('winston')

const screenFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS',
  }),
  winston.format.align(),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
)

const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS',
  }),
  winston.format.json()
  // winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
)

const workflowFormat = winston.format.combine(winston.format.timestamp(), winston.format.json())

module.exports = { screenFormat, logFormat, workflowFormat }
