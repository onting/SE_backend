var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const User = require('../models/user');

/* GET users listing. */
router.get('/:name', function(req, res, next) {

});

router.post('/', function(req, res, next) {
  const user = {
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
  }

  user.save()
      .then(result => {
        console.log(result);
      })
      .catch(err => console.log(err));
});

router.delete('/:name', function(req, res, next) {
  res.send('respond with a resource');
});

router.patch('/:name', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
