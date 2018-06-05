var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const PurchHist = require('../models/purchHist');
const Product = require('../models/product');
const Cart = require('../models/cart');

router.post('/hist', function(req, res, next){ //카트에서 가져오기
    const purchHist = new PurchHist({
        _id: new mongoose.Types.ObjectId,
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
        order_list: req.body.order_list,
        payment_method: req.body.payment_method,
        name_recv: req.body.name_recv,
        phone_recv: req.body.phone_recv,
        post_code: req.body.post_code,
        address: req.body.address,
        address_detail: req.body.address_detail,
        purchase_date: req.body.purchase_date
    })
    purchHist.save()
        .then(result => {
            Cart.remove({email: email})
                .exec();
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        })
})

router.post('/hist/move/:email', function(req, res, next){ //카트에서 가져오기
    const email = req.params.email;
    Cart.findOne({email: email})
        .exec()
        .then(result => {
            console.log(result);
            if(result) {
                const purchHist = new PurchHist({
                    _id: new mongoose.Types.ObjectId,
                    name: req.body.name,
                    phone: req.body.phone,
                    email: result.email,
                    order_list: result.order_list,
                    payment_method: req.body.payment_method,
                    name_recv: req.body.name_recv,
                    phone_recv: req.body.phone_recv,
                    post_code: req.body.post_code,
                    address: req.body.address,
                    address_detail: req.body.address_detail,
                    purchase_date: req.body.purchase_date
                });
                purchHist.save()
                    .then(result => {
                        Cart.remove({email: email})
                            .exec();
                        res.status(200).json(result)
                    })
            }
            else{
                res.status(300).end();
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        })
})

router.patch('/hist/receive/:purchId', function(req, res, next){ //상품 수령
    const purchId = req.params.purchId;

    PurchHist.findByIdAndUpdate(purchId, {$set: {receive_date: Date.now()}})
        .exec()
        .then(result => {
            result.order_list.map(res => {
                Product.findByIdAndUpdate(res.product_id, {$inc: {stock: -res.order_list, total_sell: res.amount}})
                    .exec();
            })
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        });
})

router.patch('/hist/return/:purchId', function(req, res, next){ //상품 반품
    const purchId = req.params.purchId;

    PurchHist.findByIdAndUpdate(purchId, {$set: {return: true}})
        .exec()
        .then(result => {
            result.order_list.map(res => {
                Product.findByIdAndUpdate(res.product_id, {$inc: {stock: res.order_list, total_sell: -res.amount}})
                    .exec();
            })
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })

});

router.get('/hist', function(req, res, next){ //사용자 구매기록 조회
    PurchHist.find()
        .exec()
        .limit(20)
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

router.get('/hist/:email', function(req, res, next){ //사용자 구매기록 조회
    const id = req.params.email;
    PurchHist.find({email: id})
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

router.get('/date', function(req, res, next){
    PurchHist.find()
        .sort({$natural: 1})
        .limit(10)
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
})

router.get('/sell', function(req, res, next){
    var result = [];
    PurchHist.find({ 
        purchase_date : { 
          $lt: new Date(), 
          $gte: new Date(new Date().setDate(new Date().getDate() - 5))}
        })
        .exec()
        .then(docs => {
            Product.find({_id: {$in:docs.map(ele => ele.product_id)}})
                .exec()
                .then(docs => {
                    for(var i=0; i<5; i++){
                        result.push(docs.filter(function(elem){
                            (elem <= (new Date(new Date().setDate(new Date().getDate() - i))))
                            && (elem >= (new Date(new Date().setDate(new Date().getDate() - (i+1)))))
                        }).map(ele => ele.total_sell).reduce(function(acc, val){
                            return acc+val;}, 0));
                    }
                  res.status(200).json(result);  
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
})

module.exports = router;