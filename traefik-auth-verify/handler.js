'use strict'
const process = require('process')
const crypto = require('crypto')
const SharedSecret = require('./secrets/sharedSecret')
const BasicAuthValidator = require('./authentication/basicAuthValidator')

module.exports = async (context, callback) => {
  let auth = new BasicAuthValidator()
  let valid = await auth.validate(process.env.Http_Authorization)
  if (!valid) {
    throw new Error('Not authorized')
  }
  if (callback) {
    callback(undefined, { status: 'ok' })
  }
}

/**
 * @param {string} path
 */
function validateCaller (path) {
  const InvalidCallerMessage = 'Invalid caller'
  if (!path || !path.startsWith('/')) {
    throw new Error(InvalidCallerMessage)
  }
  let token = path.slice('1')
  if (token.length !== SharedSecret.length) {
    throw new Error(InvalidCallerMessage)
  }
  if (!crypto.timingSafeEqual(Buffer.from(token), Buffer.from(SharedSecret))) {
    throw new Error(InvalidCallerMessage)
  }
}
