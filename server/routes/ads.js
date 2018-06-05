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
      console.log(err);
      res.end(err);
    })
});

router.post('/:num', upload.single('img'), function(req, res, next) {
  const num = req.params.num;
  const img = {data: req.file.buffer, contentType: 'image/' + req.file.originalname.split('.').pop()};

  Ad.update({num: num}, {$set: {img: img}, 
    $setOnInsert: {_id: new mongoose.Types.ObjectId, num: num, img: img}}, {upsert: true})
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
      });
})

module.exports = router;