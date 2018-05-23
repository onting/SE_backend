var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const Product = require('../models/product');

/* GET users listing. */
router.get('/:name', function(req, res, next) {
  res.send('respond with a resource');
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
