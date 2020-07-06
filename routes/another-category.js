var express = require('express');
var router = express.Router();
var categoryModel = require("../model/categorySchema");
var moment = require("moment");

router.post('/', function (req, res, next) {

    var sessionUserDetails = req.session.userDetails;
    var creator = sessionUserDetails._id;
    var categoryName = req.body.categoryName;
  
    var date = moment().format('LLL');
    categoryModel.aggregate([{
      $match: {
        $and: [
          { category: categoryName },
          { 'author.id': creator },
        ]
      }
    }]).exec(function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result.length != 0) {
        res.redirect("/new-post/:" + creator);
      } else {
        var categoryInstance = new categoryModel({
          author: {
            id: creator,
            name: sessionUserDetails.username,
          },
          category: categoryName,
          date: date,
        });
        categoryInstance.save(function (err, data) {
          if (err) throw err;
          res.redirect("/new-post/:" + creator);
        })
      }
    })
  })




  module.exports = router;