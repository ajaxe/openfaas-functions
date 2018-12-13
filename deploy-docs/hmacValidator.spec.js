const HmacValdiator = require('./hmacValidator');
const crypto = require("crypto");
const assert = require("assert");

const secret = "foobar";
const payload = "harry had a funny hat";

function getHmacValidatorInstance() {
    return new HmacValdiator(secret)
}

let testerHmac = crypto.createHmac("sha1", secret);
testerHmac.update(payload, 'utf8');
let testerSignature = `sha1=${testerHmac.digest('hex')}`;

assert.strictEqual(getHmacValidatorInstance().validate(null, testerSignature), false, "NUL payload should return false");
assert.strictEqual(getHmacValidatorInstance().validate("", testerSignature), false, "Empty payload should return false");
assert.strictEqual(getHmacValidatorInstance().validate("silly millly", null), false, "NUL signature should return false");
assert.strictEqual(getHmacValidatorInstance().validate("silly millly", "testerSignature"), false, "Invalid signature should return false");
assert.throws(() => getHmacValidatorInstance().validate("silly millly", "sha1=testerSignature"), "Invalid payload & signarure should throw error");
assert.strictEqual(getHmacValidatorInstance().validate(payload, testerSignature), true, "Valid inputs: Should return true");