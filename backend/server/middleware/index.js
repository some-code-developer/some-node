/* eslint no-undef: "error" */
/* eslint-env node */

const express = require("express");
const helmet = require("helmet");
const compression = require("compression"); // use revers proxy instead
const cookies = require("cookie-parser");
const multer = require("multer");
const setLogger = require("./routesLogger");
const requestId = require("./requestId");

const upload = multer({ limits: { fieldSize: 1024 * 1024 * 1024 } }); // Sets upload limit

module.exports = (app) => {
  //
  app.use(compression()); // use reverse proxy instead
  app.use(upload.any());
  app.use(express.text());
  app.use(express.urlencoded({ limit: "70mb", extended: true }));
  app.use(express.json({ limit: "70mb", strict: true, inflate: true }));

  // Fix for loading javascript when using HTTP

  if (process.env.USE_SSL == 0) {
    const defaultCspOptions = helmet.contentSecurityPolicy.getDefaultDirectives();
    delete defaultCspOptions["upgrade-insecure-requests"];

    defaultCspOptions["connect-src"] = "'self' *.google-analytics.com";
    defaultCspOptions["script-src-elem"] = "'self' 'unsafe-inline' www.googletagmanager.com";

    app.use(
      helmet({
        crossOriginOpenerPolicy: false,
        contentSecurityPolicy: {
          useDefaults: false,
          directives: { ...defaultCspOptions },
        },
      })
    );
  } else app.use(helmet()); // <== Making everything secure for HTTPS

  express.static.mime.define({ "application/javascript": ["js"] });

  app.use(requestId);

  setLogger(app);
};
