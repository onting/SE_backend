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

router.get('/:userid', function(req, res, next) {
  const id = req.params.email;
  User.find({userid: id})
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

router.post('/login', function(req, res, next) { 
  const id = req.body.email;
  const passwd = req.body.password;

  User.find({'email': id})
      .exec()
      .then(docs =>{
        console.log(docs.password);
        console.log(passwd);
        if(docs[0].password === passwd) {
          res.status(200).json(docs);
        }

        else if(docs[0].password !== passwd){
          res.status(301).end();
        }
      })
      .catch(err =>{
        console.log(err);
        res.status(302).end();
      });
});

router.post('/', function(req, res, next) {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    password: req.body.password,
    email: req.body.email,
    name: req.body.name,
    address: req.body.address
  });

  User.findOne({userid: user.userid})
      .exec()
      .then(result => { // userid 중복
        console.log(result);
        if(result){
          user.save()
          .then(result => {
            console.log(result);
            res.status(200).json(result);
          })
          .catch(err => console.log(err));
        }
        else{
          res.end();
        }
      })
      .catch(); // userid 중복ㅇ

});

router.delete('/:userid', function(req, res, next) {
  const id = req.params.userid;
  User.remove({userid: id})
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

router.patch('/:userid', function(req, res, next) {
  const id = req.params.userid;
  const updateOps = {};

  Object.keys(req.body).forEach(function(key, index){
    updateOps[key] = req.body[key];
  })

  console.log(updateOps);

  User.update({ userid: id }, { $set: req.body })
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
