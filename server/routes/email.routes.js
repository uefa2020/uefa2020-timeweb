const {Router} = require('express');
const email = require('../controllers/email.controller');

const router = Router();

// /api/email
router.get('/sendMail', email.sendMail);
router.get('/sendMailTest', email.sendMailTest);

module.exports = router;
