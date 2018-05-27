var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({storage: storage});

const Product = require('../models/product');

/* GET users listing. */
router.get('/', function(req, res, next) { //전체 데이터 가져오기
  Product.find({}, {img: false})
      .exec()
      .then(docs =>{
        console.log(docs);
        res.status(200).json(docs);
      })
      .catch(err =>{
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});

router.post('/product', upload.single('imgs'), function(req, res, next){ //상품 추가
  var product = new Product({
    _id: new mongoose.Types.ObjectId,
    name: req.body.name,
    catalog: req.body.catalog,
    platform: req.body.platform,
    provider: req.body.provider,
    img : {data: req.file[0].buffer, contentType: 'image/' + req.file[0].originalname.split('.').pop()},
    imgSub: {data: req.file[1].buffer, contentType: 'image/' + req.file[1].originalname.split('.').pop()},
    price: req.body.price,
    stock: req.body.stock,
    reviews: []
  });
  product.save()
      .then(result => {
        res.status(200).json(result._id);
      })
      .catch(err => {
        console.log(err);
        res.status(500).end();
      });
});

router.post('/product/:prodId', upload.single('imgs'), function(req, res, next){ //상품 추가
  const prodId = res.params.prodId;
  Product.findByIdAndUpdate(prodId, {$set: {
    name: req.body.name,
    catalog: req.body.name,
    platform: req.body.platform,
    provider: req.body.provider,
    release_date: req.body.release_date,
    price: req.body.price,
    stock: req.body.stock,
    total_sell: req.body.total_sell,
    img: {data: req.file[0].buffer, contentType: 'image/' + req.file[0].originalname.split('.').pop()},
    imgSub: {data: req.file[1].buffer, contentType: 'image/' + req.file[1].originalname.split('.').pop()}
  }});
});

router.get('/image/:sel/:prodId', function(req, res, next){
  const id = req.params.prodId;
  const sel = req.params.sel;
  var img;
  Product.findById(id)
      .exec()
      .then(result =>{
        switch(sel) {
          case 1:
            img = result.img;
            break;
          case 2:
            img = result.imgSub;
            break;
        }
        res.writeHead(200, {'Content-type' : img.contentType});
        res.end(img.data);
      })
      .catch(err =>{
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
})

router.get('/product/:prodId', function(req, res, next) { //특정 아이템 가져오기
  const id = req.params.prodId;
  Product.findById(id, {img: false})
      .exec()
      .then(result =>{
        res.status(200).json(result);
      })
      .catch(err =>{
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});

router.get('/list/:platform/:catalog', function(req, res, next) { //product 리스트
  const platform = req.params.platform;
  const catalog = req.params.catalog;
  res.redirect('/products/list/' + platform + '/' + catalog + '/' + '1');
});

router.get('/list/:platform/:catalog/:listnum', function(req, res, next) { //product 리스트
  const name = req.params.platform;
  const catalog = req.params.catalog;
  const num = req.params.listnum;
  Product.find({platform: name, catalog: catalog}, {img: false, imgSub: false})
      .skip((num-1) * 20)
      .limit(20)
      .exec()
      .then(docs =>{
        res.status(200).json(docs);
      })
      .catch(err =>{
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});

router.get('/review', function(req, res, next){ //리뷰 얻어오기
  const revId = req.params.revId;

  Product.findById(revId)
      .exec()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(500).json({error: err});
      })
})

router.post('/review/:prodId', function(req, res, next){ //리뷰 작성
  const prodId = req.params.prodId;
  Product.findByIdAndUpdate(prodIdd, {$push: {reviews: {
    _id: new mongoose.Types.ObjectId,
    email: req.body.eail,
    content: req.body.content,
    rate: req.body.rate
  }}})
      .exec()
      .then(result =>{
        res.status(200).json(result);
      })
      .catch(err =>{
        res.status(500).json({
          error: err
        });
      });
})

router.get('/review/:prodId', function(req, res, next){
  const prodId = req.params.prodId;

  Product.findById(prodId)
      .exec()
      .then(result => {
        res.status(200).json(result.reviews);
      })
      .catch(err => {
        res.status(500).json({error: err});
      })
})

router.get('/review/:prodId/:rate', function(req, res, next){
  const prodId = req.params.prodId;
  const rate = req.params.rate;
  var result;

  Product.findById(prodId)
      .exec()
      .then(doc => {
        result = doc.reviews.filter(function(elem){
          return (elem.rate == rate);});
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(500).json({error: err});
      })
})

router.delete('/review/:prodId/:revId', function(req, res, next){ //리뷰 삭제
  const prodId = req.params.prodId;
  const revId = req.params.revId;
  Product.findByIdAndUpdate(prodId, {$pull: {review: {_id: revId}}})
      .exec()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(500).json({error: err});
      })
})

router.patch('/review/:prodId/:revId', function(req, res, next){ //리뷰 수정
  const prodId = req.params.prodId;
  const revId = req.params.revId;
  Product.findByIdANdUpdate(prodId, {$set: {"reviews.$.content": req.body.content, "reviews.$.rate": req.body.rate}})
      .exec()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(500).json({error: err});
      })
})

module.exports = router;
