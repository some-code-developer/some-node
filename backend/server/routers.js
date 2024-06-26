/* eslint-disable global-require */
/* eslint no-undef: "error" */
/* eslint-env node */

const express = require("express");
const path = require("node:path");
const { publicFolder } = require("./config");

module.exports = (app) => {
  app.use("/api/file-manager", require("./controllers/api/api_file_manager"));

  app.use(express.static(publicFolder));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(publicFolder, "index.html"));
  });
};
