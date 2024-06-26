/* eslint no-undef: "error" */
/* eslint-env node */

const express = require('express')
const setupMiddleware = require('./middleware')
const setupRouters = require('./routers')

const app = express()
// setup other
setupMiddleware(app)
// Setup routers
setupRouters(app)

module.exports = app
