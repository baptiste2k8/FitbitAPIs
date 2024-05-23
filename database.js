const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'buddy_db',
  connectionLimit: 10,
});

async function query(sql, params) {
  let connection;
  try {
    connection = await pool.getConnection();
    const result = await connection.query(sql, params);
    return result;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  query,
};