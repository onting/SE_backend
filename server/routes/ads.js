var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongoose = require('mongoose');
var Ad = require('../models/ad')
const storage = multer.memoryStorage();
var upload = multer({storage: storage});

router.get('/:num', function(req, res, next) { //전체 데이터 가져오기
  const num = req.params.num;

  Ad.findOne({num: num})
    .exec()
    .then(result => {
      console.log(result);
      res.writeHead(200, {'Content-type' : result.img.contentType});
      res.end(result.img.data);
    })
    .catch(err => {
      res.end(err);
    })
});

router.post('/:num', upload.single('img'), function(req, res, next) {
  const num = req.params.num;
  const ad = new Ad({
    _id: new mongoose.Types.ObjectId(),
    num: num,
    img: {data: req.file.buffer, contentType: 'image/' + req.file.originalname.split('.').pop()}
  })
  ad.save()
      .then(result => {
        res.status(200).json(result._id);
      })
      .catch(err => {
        console.log(err);
        res.status(500).end();
      });
})

module.exports = router;