/* eslint no-undef: "error" */
/* eslint-env node */

const winston = require("winston");
const { createLogger } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const { logFolder } = require("../config");
const { screenFormat, logFormat } = require("../utils/winstonFormats");

const transportsArray = [
  new winston.transports.Console({
    level: "debug",
    handleExceptions: true,
    format: screenFormat,
  }),
];

if (process.env.ENABLE_LOGGING == 1) {
  transportsArray.push(
    new DailyRotateFile({
      filename: `${logFolder}/%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      level: "info",
      json: true,
      format: logFormat,
      maxFiles: "7d",
      auditFile: `${logFolder}/audit.json`,
    })
  );
}

const CreateLogger = () => {
  const logger = createLogger({
    transports: transportsArray,
    exitOnError: false,
  });
  logger.stream = {
    write(message) {
      logger.info(message.substring(0, message.lastIndexOf("\n")));
    },
  };
  return logger;
};

const logger = CreateLogger();

module.exports = logger;
