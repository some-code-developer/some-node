/* eslint no-undef: "error" */
/* eslint-env node */

const path = require("node:path");
const os = require("os");
const fs = require("fs");

const { productEnv } = require("./product_info");

let envFolder = "";
let logFolder = "";
let filesFolder = "";

if (process.env.DATA_DIRECTORY) {
  logFolder = path.resolve(`${process.env.DATA_DIRECTORY}/log/`);
  envFolder = path.resolve(`${process.env.DATA_DIRECTORY}/config/`);
  filesFolder = path.resolve(`${process.env.DATA_DIRECTORY}/files/`);
}

// Base is used for development
else if (productEnv !== "base") {
  if (os.platform() === "win32") {
    envFolder = process.env.ProgramData;
    logFolder = process.env.ProgramData;
    filesFolder = process.env.ProgramData;
  } else {
    envFolder = "/etc";
    logFolder = "/var/log";
    filesFolder = "/var/lib";
  }
  envFolder = path.resolve(`${envFolder}/some-code.com/${productEnv}`);
  logFolder = path.resolve(`${logFolder}/some-code.com/${productEnv}`);
  filesFolder = path.resolve(`${filesFolder}/some-code.com/${productEnv}/files`);
  if (os.platform() === "win32") logFolder = path.resolve(`${logFolder}/log`);
}

const publicFolder = path.resolve(`${process.cwd()}/public/`);

// In case it is missing

fs.mkdirSync(filesFolder, { recursive: true });

module.exports = {
  publicFolder,
  logFolder,
  envFolder,
  filesFolder,
};
