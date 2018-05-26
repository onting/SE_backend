var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const Cart = require('../models/cart');

router.get('/:email', function(req, res, next) { //유저별 카트 정보
    const id = req.params.email;
    Cart.find({email: id})
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
  
router.post('/', function(req, res, next) { //주문
    const cart = new Cart({
        _id: new mongoose.Types.ObjectId(),
        product_id: req.body.product_id,
        payment_method: req.body.payment_method,
        amount: req.body.amount,
        address: req.body.address
    });

    cart.save()
        .then(result => {
          res.status(200).json(result);
        })
        .catch(err => console.log(err));
});

router.delete('/:email', function(req, res, next){ //결제 완료(cart에서 옮김)
    const id = req.params.email;
    var purchHist;
    Cart.delete({email: id})
        .exec()
        .then(result => {
            purchHist = new PurchHist({
                _id: new mongoose.Types.ObjectId(),
                product_id: req.body.product_id,
                payment_method: req.body.payment_method,
                amount: req.body.amount,
                address: req.body.address,
                purchase_date: req.body.address,
                receive_date: null
            });
            purchHist.save();
            res.status(200).json(result);
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:email',function(req, res, next){ //주문 수정
    const id = req.params.email;
    Cart.update({email: id}, {$set: req.body})
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
          });
});

module.exprots = router;