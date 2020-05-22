const mysql = require('mysql2');

const pool = mysql.createPool({
  //connectionLimit: 10,
  host: (process.env.NOD_ENV === 'production' ? '89.223.122.221' : 'localhost'),
  user: 'root',
  password: 'root',
  database: 'uefa2020',
  /*timezone: 'Z'*/
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Соединение с БД потеряно')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Слишком много соединений с БД.')
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Соединение с БД отклонено.')
    }
  }

  if (connection) {
    connection.release();
  }
});

module.exports = pool;
