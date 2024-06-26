/* eslint no-undef: "error" */
/* eslint-env node */

module.exports = {
  getErrorMessage: (err) => {
    let message = '';
    if (err instanceof Error) message = err.message;
    else message = String(err);
    return message;
  },
};
