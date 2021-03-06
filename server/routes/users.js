var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const User = require('../models/user');
const Cart = require('../models/cart');

router.get('/', function(req, res, next) { 
  User.find({role: false})
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

router.get('/:email', function(req, res, next) {
  const id = req.params.email;
  User.findOne({email: id}, {password: false})
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

router.post('/login', function(req, res, next) { 
  const id = req.body.email;
  const passwd = req.body.password;

  User.findOne({email: id})
      .exec()
      .then(result =>{
        if(result!==null){
          if(result.password === passwd) {
            result.password = undefined;
            res.status(200).json(result); // 일치하는 user가 있는 경우 200
          }
          else if(result.password !== passwd){ 
            res.status(301).end(); // email은 존재 하나 password가 틀린 경우 301
          }
        }
        else{
          res.status(302).end(); // 해당 email이 없는 경우
        }
      })
      .catch(err =>{
        console.log(err);
        res.status(500).end(); 
      });
});

router.post('/', function(req, res, next) {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: req.body.email,
    password: req.body.password,
    nickname: req.body.nickname,
    post_code: req.body.post_code,
    address : req.body.address,
    address_detail: req.body.address_detail,
    role: req.body.role,
    phone: req.body.phone
  });

  user.save()
      .then(result => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch( err => {
        console.log(err);
        res.status(301).end(); // 중복 email인 경우 301
      });
});

router.delete('/:email', function(req, res, next) { //유저 탈퇴
  const id = req.params.email;
  User.remove({email: id})
      .exec()
      .then(result =>{
        Cart.remove({email: id}).exec();
        res.status(200).json(result);
      })
      .catch(err =>{
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});

router.patch('/:email', function(req, res, next) { //유저 정보 갱신
  const id = req.params.email;
  const updateOps = {};

  Object.keys(req.body).forEach(function(key, index){
    updateOps[key] = req.body[key];
  })

  console.log(updateOps);

  User.update({ email: id }, { $set: req.body })
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

module.exports = router;
