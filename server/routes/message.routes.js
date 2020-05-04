const {Router} = require('express');
const message = require('../controllers/message.controller');

const router = Router();

// /api/message
router.get('/loadAll', message.loadAll);
router.get('/add', message.add);

module.exports = router;
