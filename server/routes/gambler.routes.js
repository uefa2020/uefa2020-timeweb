const {Router} = require('express');
const upload = require('../middleware/upload');
const gambler = require('../controllers/gambler.controller');
const router = Router();

// /api/gambler
router.get('/getPassword', gambler.getPassword);
router.get('/login', gambler.login);
router.get('/signup', gambler.signup);
router.get('/loadGamblers', gambler.loadGamblers);
router.get('/loadGambler', gambler.loadGambler);
/*router.post('/profile',
  upload.single('file'),
  gambler.profile
);*/
router.get('/deletePhoto', gambler.deletePhoto);
router.post('/updatePhoto',
  upload.single('file'),
  gambler.updatePhoto
);
router.get('/resizePhoto', gambler.resizePhoto);
router.get('/profile', gambler.profile);

module.exports = router;
