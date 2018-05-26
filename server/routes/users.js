var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const User = require('../models/user');

router.get('/', function(req, res, next) { 
  User.find()
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
  User.find({email: id})
      .exec()
      .then(docs =>{
        console.log(docs);
        docs.password = undefined;
        res.status(200).json(docs);
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
      .then(docs =>{
        if(docs!==null){
          if(docs.password === passwd) {
            docs.password = undefined; // password만 삭제
            res.status(200).json(docs); // 일치하는 user가 있는 경우 200
          }
  
          else if(docs.password !== passwd){ 
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
    address : req.body.address,
    phone: req.body.phone
  });

  user.save()
      .then(result => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch( err => {
        res.status(301).end(); // 중복 email인 경우 301
      });
});

router.delete('/:email', function(req, res, next) {
  const id = req.params.email;
  User.remove({email: id})
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
      });
});

router.patch('/:email', function(req, res, next) {
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
