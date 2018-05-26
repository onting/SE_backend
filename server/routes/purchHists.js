var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const PurchHist = require('../models/purchHist');

router.post('/', function(req, res, next) { //결제 완료(cart에서 옮김)
    const purchHist = new PurchHist({
        _id: new mongoose.Types.ObjectId(),
        product_id: req.body.product_id,
        payment_method: req.body.payment_method,
        amount: req.body.amount,
        address: req.body.address,
        purchase_date: req.body.address,
        receive_date: null
    });

    cart.save()
        .then(result => {
          res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
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