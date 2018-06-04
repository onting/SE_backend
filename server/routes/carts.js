var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const Cart = require('../models/cart');

router.get('/:email', function(req, res, next) { //유저별 카트 정보
    const id = req.params.email;
    Cart.findOne({email: id})
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

router.delete('/:email', function(req, res, next){ //카트에서 삭제
    const id = req.params.email;
    Cart.delete({email: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
});

router.patch('/:email',function(req, res, next){ //주문 수정
    const id = req.params.email;
    Cart.update({email: id}, {$set: {order_list: req.body.order_list}, 
        $setOnInsert: {_id: new mongoose.Types.ObjectId,
        email: req.body.email,
        order_list: req.body.order_list}}, {upsert: true})
        .exec()
        .then(result => {
            res.status(200).json(result);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
});

module.exports = router;