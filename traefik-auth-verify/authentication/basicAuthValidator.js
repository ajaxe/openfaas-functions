const crypto = require("crypto");
const DataRepository = require("../dataRepository");

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
  async validate(authHeader) {
    let tokens = this.parse(authHeader);
    let repo = new DataRepository();
    let cred = await repo.getCredentialById(tokens.username);
    if(!cred) {
      return false;
    }
    let credParts = cred.userSecret.split("|")
    if(credParts.length !== 2) {
      throw "Bad user data";
    }
    let storedHashed = Buffer.from(credParts[1], 'base64');
    let computeHash = this.computeHash(credParts[0], tokens.password);
    return crypto.timingSafeEqual(storedHashed, computeHash);
  }

  /**
   * @param {string} authHeader
   * @returns {BasicAuthValue}
   */
  parse(authHeader) {
    if(!authHeader) {
      throw "Empty auth header string";
    }
    let parts = authHeader.split(" ");
    if(parts.length !== 2) {
      throw "Invalid auth header format";
    }
    if(parts[0] !== "Basic") {
      throw "Invalid authentication scheme. Expect 'Basic'";
    }
    let authValue = Buffer.from(parts[1], 'base64').toString('utf8');
    let authparts = authValue.split(":");
    if(authparts.length !== 2) {
      throw "Invalid auth value in header";
    }
    return {
      scheme: parts[0],
      username: authparts[0],
      password: authparts[1]
    }
  }

  /**
   *
   * @param {string} salt
   * @param {string} password
   * @return {Buffer}
   */
  computeHash(salt, password) {
    let hasher = crypto.createHash('sha256');
    hasher.update(`${salt}${password}`);
    return hasher.digest();
  }
}
module.exports = BasicAuthValidator;