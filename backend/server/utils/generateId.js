/* eslint no-undef: "error" */
/* eslint-env node */

const crypto = require("node:crypto");

module.exports = {
  generateId: () => crypto.randomUUID(),
};

crypto;
