"use strict"
const process = require("process");
const crypto = require("crypto");
const SharedSecret = require("./secrets/sharedSecret");

module.exports = (context, callback) => {
  validateCaller(process.env.Http_Path);
  let values = {};
  Object.keys(process.env).forEach(function (key) {
    if (key.startsWith("Http_")) {
      values[key] = process.env[key];
    }
  });
  if (callback) {
    console.error(JSON.stringify(values));
    callback(undefined, { status: "done" });
  }
}

/**
 * @param {string} path
 */
function validateCaller(path) {
  const InvalidCallerMessage = "Invalid caller";
  if (!path || !path.startsWith("/")) {
    throw new Error(InvalidCallerMessage);
  }
  let token = path.slice("1");
  if (token.length !== SharedSecret.length) {
    throw new Error(InvalidCallerMessage);
  }
  if (!crypto.timingSafeEqual(Buffer.from(token), Buffer.from(SharedSecret))) {
    throw new Error(InvalidCallerMessage);
  }
}
