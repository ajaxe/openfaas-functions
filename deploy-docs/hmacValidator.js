const crypto = require("crypto");
class HmacValidator {
    constructor(secreteKey) {
        this.hmac = crypto.createHmac("sha1", secreteKey);
    }
}
module.exports = HmacValidator;

/**
 * @param {string} payload
 * @param {string} signature
 * @returns {boolean}
 */
HmacValidator.prototype.validate = function(payload, signature) {
    if(!signature || !payload) {
        return false;
    }
    let parts = signature.split("=");
    if(parts.length !== 2 || parts[0] !== "sha1") {
        return false;
    }
    this.hmac.update(payload, 'utf8');
    return crypto.timingSafeEqual(Buffer.from(signature),
        Buffer.from(`sha1=${this.hmac.digest('hex')}`));
}
