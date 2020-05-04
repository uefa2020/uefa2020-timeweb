const path = require('path');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file) {
      //let dir = path.resolve(__dirname, '../..', 'upload');
      let dir = path.resolve(__dirname, '../..', 'static');
      dir += '/' + req.body.subdir;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      cb(null, dir)
    }
  },
  filename(req, file, cb) {
    if (file) cb(null, req.body.fileName)
  }
});

module.exports = multer({
  storage
});
