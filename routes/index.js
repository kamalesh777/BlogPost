var express = require('express');
var router = express.Router();
var _ = require('lodash');
const path = require("path");
const fs = require("fs");

router.use('/upload', express.static(path.join(__dirname, '../public/post-image')));

var postModel = require("../model/uploadschema");
const { static } = require('express');

router.get('/', function (req, res, next) {
  var sessionId = req.session;
    postModel.find({}).exec(function (err, data) {
      if (!err) {
        res.render('index', { title: 'Home', lodash: _, articles: data, session: sessionId });
      } else {
        console.log(err);
      }
    })  
});

router.get('/about', function (req, res, next) {
  res.render('about', { title: 'About' });
});

router.get('/contact', function (req, res, next) {
  res.render('contact', { title: 'Contact' });
});



module.exports = router;
