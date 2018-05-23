var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const Review = require('../models/review');

/* GET users listing. */
router.get('/:name', function(req, res, next) {
  const name = req.params.name;
  res.send('respond with a resource ' + name);
});

router.post('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.delete('/:name', function(req, res, next) {
  res.send('respond with a resource');
});

router.patch('/:name', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
