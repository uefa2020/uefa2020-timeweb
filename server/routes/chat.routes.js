const {Router} = require('express');
const chat = require('../controllers/chat.controller');

const router = Router();

// /api/chat
router.get('/loadGamblers', chat.loadGamblers);
router.get('/loadMessages', chat.loadMessages);
router.get('/addMessage', chat.addMessage);

module.exports = router;
