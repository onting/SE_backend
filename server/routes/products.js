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
  Product.find({}, {img: false, imgSub: false})
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

router.get('/search/:keyword', function(req, res, next){
  const keyword = req.params.keyword;
  Product.find({name: {$regex: keyword, $options: 'ix'}}, {img: false, imgSub: false})
      .exec()
      .then(docs => {
        res.status(200).json(docs);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
      })
})

router.post('/product', upload.fields([{name: 'img', maxCount: 1}, 
          {name: 'imgSub', maxCount: 1}]), function(req, res, next){ //상품 추가
  img = req.files['img'][0];
  imgSub = req.files['imgSub'][0];
  
  var product = new Product({
    _id: new mongoose.Types.ObjectId,
    name: req.body.name,
    catalog: req.body.catalog,
    platform: req.body.platform,
    provider: req.body.provider,
    release_date: req.body.release_date,
    img : {data: img.buffer, contentType: 'image/' + img.originalname.split('.').pop()},
    imgSub: {data: imgSub.buffer, contentType: 'image/' + imgSub.originalname.split('.').pop()},
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

router.patch('/product/:prodId', upload.fields([{name: 'img', maxCount: 1}, 
          {name: 'imgSub', maxCount: 1}]), function(req, res, next){ //상품 추가
  const prodId = req.params.prodId;
  
  img = req.files['img'] ? req.files['img'][0] : undefined;
  imgSub = req.files['imgSub'] ? req.files['imgSub'][0] : undefined;

  Product.findByIdAndUpdate(prodId, {$set: {
    name: req.body.name,
    catalog: req.body.name,
    platform: req.body.platform,
    provider: req.body.provider,
    release_date: req.body.release_date,
    price: req.body.price,
    stock: req.body.stock,
    img: img ? {data: img.buffer, contentType: 'image/' + img.originalname.split('.').pop()} : this.img,
    imgSub: imgSub ? {data: imgSub.buffer, contentType: 'image/' + imgSub.originalname.split('.').pop()} : this.imgSub
  }})
      .exec()
      .then(result =>{
        res.status(200).json(result._id);
      })
      .catch(err => {
        res.status(500).json({error: err});
      })
});

router.get('/image/:sel/:prodId', function(req, res, next){
  const id = req.params.prodId;
  const sel = req.params.sel;
  var img;
  Product.findById(id)
      .exec()
      .then(result => {
        switch(Number(sel)) {
          case 1:
            img = result.img;
            break;
          case 2:
            img = result.imgSub;
            break;
        }
        if(img){
          res.writeHead(200, {'Content-type' : img.contentType});
          res.end(img.data);
        }
        else{
          res.end();
        }
      })
      .catch(err =>{
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
})

router.get('/list/:platform/:catalog', function(req, res, next) { //product 리스트
  const platform = req.params.platform;
  const catalog = req.params.catalog;
  res.redirect('/products/list/' + platform + '/' + catalog + '/' + '1');
});

router.get('/list/:platform/:catalog/:listnum', function(req, res, next){
  const platform = req.params.platform;
  const catalog = req.params.catalog;
  const num = req.params.listnum;
  var query = {};
  
  if(platform != 'all') {
    query.platform = platform;
  }
  if(catalog != 'all') {
    query.catalog = catalog;
  }

  Product.find(query, {img: false, imgSub: false})
      .skip((num-1) * 12)
      .limit(12)
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
})

router.get('/list/:platform/:catalog/:listnum/:sort/:value', function(req, res, next) { //product 리스트
  const platform = req.params.platform;
  const catalog = req.params.catalog;
  const num = req.params.listnum;
  const sort = req.params.sort;
  const value = req.params.value;
  var query = {};
  var s = {};

  s[sort] = value;
  
  if(platform != 'all') {
    query.platform = platform;
  }
  if(catalog != 'all') {
    query.catalog = catalog;
  }

  Product.find(query, {img: false, imgSub: false})
      .sort(s)
      .skip((num-1) * 12)
      .limit(12)
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

router.delete('/product/:prodId', function(req, res, next){ // 특성 product 삭제
  const id = req.params.prodId;
  Product.findByIdAndRemove(id)
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

router.post('/review/:prodId', function(req, res, next){ //리뷰 작성
  const prodId = req.params.prodId;
  Product.findByIdAndUpdate(prodId, {$push: {reviews: {
    _id: new mongoose.Types.ObjectId,
    title: req.body.title,
    email: req.body.email,
    content: req.body.content,
    rate: req.body.rate
  }}})
      .exec()
      .then(result =>{
        res.status(200).end();
      })
      .catch(err =>{
        res.status(500).json({
          error: err
        });
      });
})

router.get('/review/:prodId', function(req, res, next){
  const prodId = req.params.prodId;

  Product.findById(prodId, {img: false, imgSub: false})
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

  Product.findById(prodId, {img: false, imgSub: false})
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
  Product.findByIdAndUpdate(prodId, {$set: {"reviews.$.content": req.body.content, "reviews.$.rate": req.body.rate}})
      .exec()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(500).json({error: err});
      })
})

router.get('/sell', function(req, res, next){
  var ts = {
    XBOX: {hardware: 0, title: 0},
    Nintendo: {hardware: 0, title: 0},
    PlayStation: {hardware: 0, title: 0}
  };

  Product.find({}, {total_sell: true, platform: true, catalog: true})
      .exec()
      .then(docs => {
        ts.XBOX.hardware = docs.filter(function(elem){
          return (elem.platform == "XBOX") && (elem.catalog == "hardware");}).map(ele => ele.total_sell).reduce(function(acc, val){
            return acc+val
          }, 0);
        ts.XBOX.title = docs.filter(function(elem){
          return (elem.platform == "XBOX") && (elem.catalog == "title");}).map(ele => ele.total_sell).reduce(function(acc, val){
            return acc+val
          }, 0);
        ts.Nintendo.hardware = docs.filter(function(elem){
          return (elem.platform == "Nintendo") && (elem.catalog == "hardware");}).map(ele => ele.total_sell).reduce(function(acc, val){
            return acc+val
          }, 0);
        ts.Nintendo.title = docs.filter(function(elem){
          return (elem.platform == "Nintendo") && (elem.catalog == "title");}).map(ele => ele.total_sell).reduce(function(acc, val){
            return acc+val
          }, 0);
        ts.PlayStation.hardware = docs.filter(function(elem){
          return (elem.platform == "PlayStation") && (elem.catalog == "hardware");}).map(ele => ele.total_sell).reduce(function(acc, val){
            return acc+val
          }, 0);
        ts.PlayStation.title = docs.filter(function(elem){
          return (elem.platform == "PlayStation") && (elem.catalog == "title");}).map(ele => ele.total_sell).reduce(function(acc, val){
            return acc+val
          }, 0);
        res.status(200).json(ts);
      })
      .catch(err => {
        res.status(500).json({error: err})
      })
})

router.get('/sell', function(req, res, next){
  var ts = {
    XBOX: {hardware: 0, title: 0},
    Nintendo: {hardware: 0, title: 0},
    PlayStation: {hardware: 0, title: 0}
  };

  Product.find({}, {total_sell: true, platform: true, catalog: true})
      .exec()
      .then(docs => {
        ts.XBOX.hardware = docs.filter(function(elem){
          return (elem.platform == "XBOX") && (elem.catalog == "hardware");}).map(ele => ele.total_sell).reduce(function(acc, val){
            return acc+val
          }, 0);
        ts.XBOX.title = docs.filter(function(elem){
          return (elem.platform == "XBOX") && (elem.catalog == "title");}).map(ele => ele.total_sell).reduce(function(acc, val){
            return acc+val
          }, 0);
        ts.Nintendo.hardware = docs.filter(function(elem){
          return (elem.platform == "Nintendo") && (elem.catalog == "hardware");}).map(ele => ele.total_sell).reduce(function(acc, val){
            return acc+val
          }, 0);
        ts.Nintendo.title = docs.filter(function(elem){
          return (elem.platform == "Nintendo") && (elem.catalog == "title");}).map(ele => ele.total_sell).reduce(function(acc, val){
            return acc+val
          }, 0);
        ts.PlayStation.hardware = docs.filter(function(elem){
          return (elem.platform == "PlayStation") && (elem.catalog == "hardware");}).map(ele => ele.total_sell).reduce(function(acc, val){
            return acc+val
          }, 0);
        ts.PlayStation.title = docs.filter(function(elem){
          return (elem.platform == "PlayStation") && (elem.catalog == "title");}).map(ele => ele.total_sell).reduce(function(acc, val){
            return acc+val
          }, 0);
        res.status(200).json(ts);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
      })
})

module.exports = router;
