/* eslint no-undef: "error" */
/* eslint-env node */

require("dotenv").config();

const { envFolder } = require("./server/config");

const os = require("os");
const cluster = require("cluster");
const https = require("https");
const fs = require("fs");
const path = require("node:path");

const app = require("./server/server_app");
const logger = require("./server/middleware/logger");

const PORT = process.env.WEB_SERVER_PORT || 5000;

logger.info("Console log started");

// HTTP Server
function start_http_server() {
  // running multiple node processes
  if (process.env.USE_CLUSTER == 1) {
    const clusterWorkerSize = os.cpus().length;

    if (clusterWorkerSize > 1) {
      if (cluster.isMaster) {
        for (let i = 0; i < clusterWorkerSize; i++) cluster.fork();
        cluster.on("exit", (worker) => {
          logger.info(`Worker ${worker.id} has exited.`);
        });
      } else {
        app.listen(PORT, () => {
          logger.info(`Server is listening on port ${PORT} and worker ${process.pid}`);
        });
      }
    } else {
      app.listen(PORT, () => {
        logger.info(`Server listening on port ${PORT} with the single worker ${process.pid}`);
      });
    }
  } else {
    var server = app.listen(PORT, () => {
      const host = server.address().address;
      const { port } = server.address();
      logger.info(`App is listening at http://${host}:${port}`);
    });
  }
}

// HTTPS Server
function start_https_server() {
  logger.info("Reading keys");

  const serverKey = path.resolve(`${envFolder}/server.key`);
  const serverCertificate = path.resolve(`${envFolder}/server.cer`);

  logger.info(serverKey);
  logger.info(serverCertificate);

  if (fs.existsSync(serverKey)) var key = fs.readFileSync(serverKey);
  else {
    logger.error(`${serverKey} Not Found`);
    return;
  }

  if (fs.existsSync(serverCertificate)) var cert = fs.readFileSync(serverCertificate);
  else {
    logger.error(`${serverKey} Not Found`);
    return;
  }

  // running multiple node processes
  if (process.env.USE_CLUSTER == 1) {
    const clusterWorkerSize = os.cpus().length;

    if (clusterWorkerSize > 1) {
      if (cluster.isMaster) {
        for (let i = 0; i < clusterWorkerSize; i++) cluster.fork();

        cluster.on("exit", (worker) => {
          logger.info("Worker", worker.id, " has exited.");
        });
      } else {
        https.createServer({ key, cert }, app).listen(PORT, () => {
          logger.info(`Server is listening on port ${PORT} and worker ${process.pid}`);
        });
      }
    } else {
      https.createServer({ key, cert }, app).listen(PORT, () => {
        logger.info(`Server listening on port ${PORT} with the single worker ${process.pid}`);
      });
    }
  } else {
    var server = https.createServer({ key, cert }, app).listen(PORT, () => {
      const host = server.address().address;
      const { port } = server.address();
      logger.info(`App is listening at https://${host}:${port}`);
    });
  }
}

if (process.env.USE_SSL == 1) start_https_server();
else start_http_server();
