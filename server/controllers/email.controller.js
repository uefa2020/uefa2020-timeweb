const pool = require('../middleware/database');
const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
module.exports.sendMailTest = async (req, res) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  res.json({'email': 'sent'})
};

module.exports.sendMail = async (req, res) => {
  let smtpTransport;

  try {
    smtpTransport = await nodemailer.createTransport({
      //service: 'mail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports 587
      auth: {
        user: 'myagkovhyurij@gmail.com',
        pass: 'Gtnhjdrf38'
      }
    });
  } catch (e) {
    res.json({'error': e.name + ':' + e.message});
  }

  const query = 'SELECT `key` FROM `authkeys` WHERE `status` = 0 LIMIT 1';
  let authkey = '';

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
    authkey = rows[0].key;
  });

  if (authkey === '') res.json({'error': 'Ключ регистрации не найден'});

  /*let msg = 'Для регистрации перейдите по ссылке: http://localhost:3000/registration/' + authkey;*/
  let msg = 'Для регистрации перейдите по ссылке <a href="http://localhost:3000/signup/' + authkey + '"><i>Регистрация</i></a>';

  let mailOptions = {
    from: 'myagkovhyurij@gmail.com', // sender address
    to: req.query.email, // list of receivers
    subject: 'Регистрация в клубе', // Subject line
    /*text: msg, // plain text body*/
    html: msg // html body
  };

  await smtpTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json(error)
    } else {
      console.log('authkey:', authkey);
      const query = 'UPDATE `authkeys` SET `status` = -1 WHERE `status` = 0 AND `key` = ?';
      pool.promise().execute(query, [authkey], function (err, results) {
        if (err) {
          console.log('error Update:', err);
          res.json({'error': err});
        }
      });
      res.status(200).json({'success': 'Письмо по адресу ' + req.query.email + ' отправлено'})
    }
  })
};

/*async function getTransport() {
  try {
    return await nodemailer.createTransport({
      //service: 'mail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports 587
      auth: {
        user: 'myagkovhyurij@gmail.com',
        pass: 'Gtnhjdrf38'
      }
    });
  } catch (e) {
    return console.log('Error: ' + e.name + ":" + e.message);
  }
}*/

/*module.exports.sendMail = async (req, res) => {
  let smtpTransport;
  try {
    smtpTransport = await nodemailer.createTransport({
      //service: 'mail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports 587
      auth: {
        user: 'myagkovhyurij@gmail.com',
        pass: 'Gtnhjdrf38'
      }
    });
  } catch (e) {
    return console.log('Error: ' + e.name + ":" + e.message);
  }

  let mailOptions = {
    from: 'myagkovhyurij@gmail.com', // sender address
    to: 'y-myagkov@mail.ru', // list of receivers
    subject: 'Обращение с сайта baedeker.club', // Subject line
    text: 'Обращение с сайта baedeker.club', // plain text body
    html: '<h1>Test</h1>' // html body
  };

  await smtpTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('sendMail Error:', error);
    } else {
      console.log('Message sent: %s', info.messageId);
      res.status(200).json({'email_1': 'sent'})
    }
  })
};*/
