const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../middleware/database');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

module.exports.getPassword = async (req, res) => {
  await bcrypt.genSalt(10, async function (err, salt) {
    bcrypt.hash('Rcdjhf,f[', salt, function (err, hash) {
      res.json({'password': hash});
    })
  })

  /*bcrypt.hash("Rcdjhf,f[", null, null, function (err, hash) {
    res.json({'password': hash});
  });*/
};

//Rcdjhf,f[ - $2a$10$Umn2iSCebbSL3.nBNueCcOnbnPMIQmXHd6CBbZpv6H5ishGmVptp2

module.exports.signup = async (req, res) => {
  const nickname = req.query.nickname;
  let gambler = null;
  let query = 'INSERT gamblers(`nickname`, `password`) VALUES(?, ?)';

  await bcrypt.genSalt(10, async function (err, salt) {
    await bcrypt.hash(req.query.password, salt, async function (err, hash) {
      await pool.promise().execute(query, [nickname, hash])
      .then(async (result) => {
        if (result) {
          query = 'SELECT * FROM gamblers WHERE `id` = ?';
          await pool.promise().execute(query, [result[0].insertId])
          .then(([rows, fields]) => {
            gambler = rows[0];
          });

          const token = jwt.sign({
              login: gambler.nickname,
              id: gambler.id
            },
            'uefa-2020',
            {expiresIn: 60 * 60 * 8} // 8 часов будет "жить" токен
          );

          res.json({gambler, token})
        } else {
          res.json({error: 'Ошибка регистрации'})
        }
      })
      .catch((e) => {
        res.json({error: e.message})
      })
    });
  });
};

module.exports.login = async (req, res) => {
  let error = 'Пользователь с такими логином и паролем отсутствует';
  const query = 'SELECT * FROM `gamblers` WHERE `nickname` = ?';

  await pool.promise().execute(query, [req.query.login])
  .then(([rows, fields]) => {
    const gambler = rows[0];

    if (gambler) {
      bcrypt.compare(req.query.password, gambler.password, function (err, result) {
        if (result) {
          const token = jwt.sign({
              login: gambler.nickname,
              id: gambler.id
            },
            'uefa-2020',
            {expiresIn: 60 * 60 * 8} // 8 часов будет "жить" токен
          );

          res.json({gambler: gambler, token: token})
        } else {
          res.json({error})
        }
      })
    } else {
      res.json({error})
    }
  });
};

module.exports.loadGambler = async (req, res) => {
  const query = 'SELECT * FROM `gamblers` WHERE `id` = ?';
  await pool.promise().execute(query, [req.query.id])
  .then(([rows, fields]) => {
    if (rows[0]) {
      res.json(rows[0])
    } else {
      res.json({error: 'Пользователь отсутствует. Токен сброшен.'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.loadGamblers = async (req, res) => {
  const query = 'SELECT * FROM gamblers ORDER BY points DESC, nickname';

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
    res.json(rows)
  })
  /*.catch((e) => {
    res.status(500).json(e)
  })*/
};

module.exports.deletePhoto = async (req, res) => {
  let dir = path.resolve(__dirname, '../..', 'static');
  const photo = dir + '/photo/' + req.query.oldFile;

  fs.unlink(photo, function (err) {
    if (err) {
      res.json(err);
    } else {
      res.json(`Файл ${req.query.oldFile} удалён`);
    }
  });
};

module.exports.updatePhoto = async (req, res) => {
  res.json({success: `Файл "${req.body.fileName}" добавлен`})
};

module.exports.resizePhoto = async (req, res) => {
  let dir = path.resolve(__dirname, '../..', 'static');
  const image = dir + '/photo/' + req.query.fileName;

  sharp(image)
  .toBuffer()
  .then(data => {
    sharp(data)
    .resize(150, 200)
    .toFile(image, (err, info) => {
      if (err) res.json({error: err});
      res.json(info)
    });
  })
  .catch(err => {
    res.json({error: err.message})
  });
};

module.exports.profile = async (req, res) => {
  let query = 'UPDATE gamblers SET ' +
    '`nickname` = ?, ' +
    '`family` = ?, ' +
    '`name` = ?, ' +
    '`sex` = ?, ' +
    '`photo` = ?, ' +
    '`status` = 1 ' +
    'WHERE `id` = ?';

  await pool.promise().execute(query, [
    req.query.nickname,
    req.query.family,
    req.query.name,
    req.query.sex,
    req.query.fileName,
    req.query.id
  ])
  .then(async (result) => {
    if (result) {
      const query = 'SELECT * FROM `gamblers` WHERE `id` = ?';
      await pool.promise().execute(query, [req.query.id])
      .then(([rows, fields]) => {
        if (rows[0]) {
          res.json(rows[0])
        } else {
          res.json({error: 'Пользователь отсутствует.'})
        }
      })
      .catch((e) => {
        res.json({error: e.message})
      })
    } else {
      await res.json({error: 'Ошибка при обновлении профиля участника'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};
