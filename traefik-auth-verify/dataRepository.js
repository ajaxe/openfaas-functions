const mariadb = require('mariadb');
const DbConfig = require('./secrets/dbConfig');
const pool = mariadb.createPool(DbConfig);

class DataRepository {
/**
 *
 * @typedef {Object} UserSecret
 * @property {string} username
 * @property {string} userSecret
 */
  /**
   *
   * @param {string} keyId
   * @returns {UserSecret}
   */
  async getCredentialById(keyId) {
    let conn;
    try {
      conn = await pool.getConnection();
      let rows = await conn.query("SELECT username, userSecret FROM ApiCredentials WHERE Username = ?", [keyId]);
      if(rows && rows.length > 0) {
        return rows[0];
      }
      return null;
    }
    catch(err) {
      throw err;
    }
    finally {
      if(conn) {
        conn.end();
      }
    }
  }
  static disposePool() {
    if(pool) {
      pool.end();
    }
  }
}
module.exports = DataRepository;