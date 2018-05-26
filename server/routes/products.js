var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

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

router.post('/', function(req, res, next){ //도큐먼트 삽입
  res.end();
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

router.get('/:name', function(req, res, next) { //특정 아이템 가져오기
  const name = req.params.name;

  Product.find({name: name}, {})
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

router.delete('/:name', function(req, res, next) { //특정 아이템 지우기
  const name = req.params.name;
  Product.remove({name: name})
      .exec()
      .then(result =>{
        console.log(result);
        res.status(200).json(result);
      })
      .catch(err =>{
        console.log(err);
        res.status(500).json({
          error: err
        });
      })
});

router.patch('/:name', function(req, res, next) { //특정 아이템 업데이트
  const name = req.params.name;
  Product.Update({name: name}, {$set: req.body})
      .exec()
      .then(result =>{
        console.log(result);
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      })
});

module.exports = router;
