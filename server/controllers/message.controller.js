const pool = require('../middleware/database');

module.exports.loadAll = async (req, res) => {
  const query = 'SELECT * FROM messages ORDER BY `date`';

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
      res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.add = async (req, res) => {
  const query = 'INSERT INTO messages (`from`, `to`, `message`) VALUES (?, ?, ?)';

  await pool.promise().execute(query, [
    req.query.from,
    req.query.to,
    req.query.message,
  ])
  .then(async (result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при добавлении нового сообщения в таблицу messages'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};
