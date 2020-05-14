const pool = require('../middleware/database');

module.exports.loadGamblers = async (req, res) => {
  //const query = 'SELECT * FROM gamblers WHERE `connected` = 1 ORDER BY nickname';
  const query = 'SELECT * FROM gamblers WHERE `socket_id` <> \'\' ORDER BY nickname';

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.loadMessages = async (req, res) => {
  const query = 'SELECT IFNULL(g.nickname, \'администратор\') AS `from`, ' +
    'IFNULL(g.photo, \'\') AS `photo`, m.message, m.date ' +
    'FROM messages m ' +
    'LEFT JOIN gamblers g ON m.`from` = g.id ' +
    'ORDER BY m.date';

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
      res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.saveMessage = async (req, res) => {
  const query = 'INSERT INTO messages (`from`, `to`, `message`) VALUES (?, ?, ?)';

  await pool.promise().execute(query, [
    req.query.from,
    req.query.to,
    req.query.message,
  ])
  .then((result) => {
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
