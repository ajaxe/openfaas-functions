const crypto = require('crypto')
const DataRepository = require('../dataRepository')

/**
 * Split the Authorization header value to two tokens.
 * throws error if there are not 2 tokens.
 * @param {string} authHeader
 * @returns string array of authorization value tokens
 */
const splitAuthHeader = function (authHeader) {
  let parts = authHeader.split(' ')
  if (parts.length !== 2) {
    throw new Error('Invalid auth header format')
  }
  return parts
}
/**
 * Parses Basic authentication header value based on Basic auth scheme.
 * @param {string[]} authHeaderTokens authentication header value tokens
 */
const getBasicAuthScheme = function (authHeaderTokens) {
  let authValue = Buffer.from(authHeaderTokens[1], 'base64').toString('utf8')
  let authparts = authValue.split(':')
  if (authparts.length !== 2) {
    throw new Error('Invalid auth value in header')
  }
  return {
    scheme: authHeaderTokens[0],
    username: authparts[0],
    password: authparts[1]
  }
}

const validateBasicScheme = function (scheme) {
  if (scheme !== 'Basic') {
    throw new Error("Invalid authentication scheme. Expect 'Basic'")
  }
}

class BasicAuthValidator {
  /**
   * @typedef {Object} BasicAuthValue
   * @property {string} scheme
   * @property {string} username
   * @property {string} password
   */
  /**
   * @param {string} authHeader
   * @returns {boolean}
   */
  async validate (authHeader) {
    let tokens = this.parse(authHeader)
    let repo = new DataRepository()
    let cred = await repo.getCredentialById(tokens.username)
    if (!cred) {
      return false
    }
    let credParts = cred.userSecret.split('|')
    if (credParts.length !== 2) {
      throw new Error('Bad user data')
    }
    let storedHashed = Buffer.from(credParts[1], 'base64')
    let computeHash = this.computeHash(credParts[0], tokens.password)
    return crypto.timingSafeEqual(storedHashed, computeHash)
  }

  /**
   * @param {string} authHeader
   * @returns {BasicAuthValue}
   */
  parse (authHeader) {
    if (authHeader) {
      let authHeaderTokens = splitAuthHeader(authHeader)
      validateBasicScheme(authHeaderTokens[0])
      return getBasicAuthScheme(authHeaderTokens)
    }
    throw new Error('Empty auth header string')
  }

  /**
   *
   * @param {string} salt
   * @param {string} password
   * @return {Buffer}
   */
  computeHash (salt, password) {
    let hasher = crypto.createHash('sha256')
    hasher.update(`${salt}${password}`)
    return hasher.digest()
  }
}
module.exports = BasicAuthValidator
