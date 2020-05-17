const {Router} = require('express');
const chat = require('../controllers/chat.controller');

const router = Router();

// /api/chat
router.get('/loadGamblers', chat.loadGamblers);
router.get('/loadMessages', chat.loadMessages);
router.get('/saveMessage', chat.saveMessage);
router.get('/updateMessage', chat.updateMessage);
router.get('/deleteMessage', chat.deleteMessage);

module.exports = router;
