var express = require('express');
var router = express.Router();
var _ = require('lodash');

var postModel = require("../model/uploadschema");
var findPost = postModel.find({});

router.get('/:id', function (req, res, next) {

    let param_id = req.params.id;

    var findId = postModel.findById({_id: param_id});
    findId.exec(function(err, post){
      if (err) {
        console.log(err);
      }
      res.render("view-details", {title: post.titile, data: post, lodash: _})   
    })
  })



module.exports = router;