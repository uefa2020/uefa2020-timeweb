const sharp = require('sharp');
const path = require('path');

module.exports.resize = async (req, res) => {
  let dir = path.resolve(__dirname, '../..', 'static');
  const image = dir + '/' + req.query.image;
  console.log('image:', image);

  sharp(image)
  .toBuffer()
  .then(data => {
    sharp(data)
    .resize(150, 200)
    .toFile(dir + '/' + req.query.image, (err, info) => {
      if (err) res.json(err);
      res.json(info)
    });
  })
  .catch( err => {
    res.json({error: err.message})
  });
};
