var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fs = require('fs');
var path = require('path');

const imgDir = '/img';
const Product = require('../models/product');

/* GET users listing. */
router.get('/', function(req, res, next) { //전체 데이터 가져오기
  Product.find()
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

router.post('/', function(req, res, next){ //상품 추가
  var product = new Product({
    _id: new mongoose.Types.ObjectId,
    name: req.body.name,
    catalog: req.body.catalog,
    platform: req.body.platform,
    provider: req.body.provider,
    price: req.body.price,
    stock: req.body.stock,
    reviews: []
  });
  product.save()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).end();
      });
});

router.get('/:platform/:catalog', function(req, res, next) { //product 리스트
  res.redirect('1');
});

router.get('/:platform/:catalog/:listnum', function(req, res, next) { //product 리스트
  const name = req.params.platform;
  const catalog = req.params.catalog;
  const num = req.params.listnum;
  Product.find({platform: name, catalog: catalog})
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

router.get('/:prodId', function(req, res, next) { //특정 아이템 가져오기
  const id = req.params.prodId;

  Product.findById(id)
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

router.delete('/:prodId', function(req, res, next) { //특정 아이템 지우기
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
      })
});

router.patch('/:prodId', function(req, res, next) { //특정 아이템 업데이트
  const id = req.params.prodId;
  Product.findByIdAndUpdate(id, {$set: {name: req.body.name,
    catalog: req.body.catalog,
    platform: req.body.platform,
    provider: req.body.provider,
    price: req.body.price}})
      .exec()
      .then(result =>{
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      })
});

router.post('/:prodId/review', function(req, res, next){ //리뷰 작성
  const id = req.params.prodId;
  Product.findByIdAndUpdate(id, {$push: {reviews: {
    _id: new mongoose.Types.ObjectId,
    nickname: req.body.nickname,
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

router.delete('/:prodId/review/:revId', function(req, res, next){ //리뷰 삭제
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

router.patch('/:prodId/review/:revId', function(req, res, next){ //리뷰 수정
  const prodId = req.params.prodId;
  const revId = req.params.revId;
  Product.findByIdAndUpdate(revId, {$set: {content: req.body.content, rate: req.body.rate}})
      .exec()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(500).json({error: err});
      })
})

router.get('/:prodId/review/:revId', function(req, res, next){ //리뷰 얻어오기
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

module.exports = router;
