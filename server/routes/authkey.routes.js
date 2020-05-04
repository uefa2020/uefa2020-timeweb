const {Router} = require('express');
const authkey = require('../controllers/authkey.controller');

const router = Router();

// /api/authkey
router.get('/loadAuthkey', authkey.loadAuthkey);
router.get('/checkKey', authkey.checkKey);
router.get('/resetKey', authkey.resetKey);

module.exports = router;
