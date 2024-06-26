/* eslint no-undef: "error" */
/* eslint-env node */

require("dotenv").config();

const app = require("./server/server_app");
const logger = require("./server/middleware/logger");

const PORT = process.env.WEB_SERVER_PORT || 5000;

logger.info("Console log started");

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT} with the single worker ${process.pid}`);
});
