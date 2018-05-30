var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const PurchHist = require('../models/purchHist');
const Product = require('../models/product');

router.post('/', function(req, res, next){ //주문 완료
    const purchHist = new PurchHist({
        _id: new mongoose.Types.ObjectId,
        email: req.body.email,
        product_id: req.body.product_id,
        payment_method: req.body.payment_method,
        amount: req.body.amount,
        address: req.body.address,
        purchase_date: req.body.address,
        receive_date: null,
    });
    purchHist.save()
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
})

router.patch('/:purchId/receive', function(req, res, next){ //상품 수령
    const purchId = req.params.purchId;

    PurchHist.findByIdAndUpdate(purchId, {$set: {receive_date: Date.now()}})
        .exec()
        .then(result => {
            Product.findByIdAndUpdate(result.product_id, {$inc: 
                {stock: -result.amount, total_sell: this.price*result.amount}});
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
            Product.findByIdAndUpdate(result.product_id, {$inc: 
                {stock: result.amount, total_sell: -this.price*result.amount}});
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

module.exports = router;