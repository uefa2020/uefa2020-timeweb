const bcrypt = require('bcryptjs');
const pool = require('../middleware/database');

module.exports.loadAuthkey = async (req, res) => {
  const query = 'INSERT authkeys(`key`) VALUES(?)';

  for (let i = 0; i < 50; i++) {
    await bcrypt.genSalt(10, async function (err, salt) {
      let str = Math.random().toString().substr(3, 11);
      await bcrypt.hash(str, salt, function (err, hash) {
        pool.promise().execute(query, [hash], function (err, results) {
          if (err) console.log(err);
        });
      })
    })
  }

  res.json({'authkey': 'success'});
};

module.exports.checkKey = async (req, res) => {
  const query = 'SELECT * FROM `authkeys` WHERE (`status` = -1) AND (`key` = ?)';

  await pool.promise().execute(query, [req.query.key])
  .then(([rows, fields]) => {
    if (rows.length > 0) {
      res.json(true)
    } else {
      res.json({error: 'Ключ авторизации не найден'})
    }
  })
  .catch(e => {
    res.json({error: e.message})
  });
};

module.exports.resetKey = async (req, res) => {
  const query = 'UPDATE `authkeys` SET `status` = 1 WHERE `key` = ?';

  await pool.promise().execute(query, [req.query.key])
  .then(result => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка сброса ключа авторизации'})
    }
  })
  .catch(e => {
    res.json({error: e.message})
  })
};
