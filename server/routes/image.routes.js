const {Router} = require('express');
const image = require('../controllers/image.controller');

const router = Router();

// /api/image
router.get('/resize', image.resize);

module.exports = router;
