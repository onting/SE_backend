var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const PurchHist = require('../models/purchHist');
const Product = require('..models/product');

router.patch('/:purchId/receive', function(req, res, next){ //상품 수령
    const purchId = req.params.purchId;

    PurchHist.findByIdAndUpdate(purchId, {$set: {receive_date: Date.now()}})
        .exec()
        .then(result => {
          res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})

router.patch('/:purchId/return', function(req, res, next){ //상품 반품
    const purchId = req.params.purchId;

    PurchHist.findByIdAndUpdate(purchId, {$set: {return: true}})
        .exec()
        .then(result => {
            Product.findByIdAndUpdate(result.product_id, {$set: 
                {stock: this.stock+result.amount, 
                total_sell: this.total_sell - this.price*result.amount}});
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

});

router.get('/:email', function(req, res, next){ //사용자 구매기록 조회
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

router.patch