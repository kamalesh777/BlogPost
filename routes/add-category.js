var express = require("express");
var router = express.Router();
const { check, validationResult } = require('express-validator');
var moment = require("moment");
var categoryModel = require("../model/categorySchema");
const { result } = require("lodash");
var findCategory = categoryModel.find({});

router.get("/", function (req, res, next) {
    if (req.isAuthenticated()) {
        var sessionUserDetails = req.session.userDetails;
        let _id = sessionUserDetails._id;
        categoryModel.find({'author.id': _id }).exec(function (err, result) {
            res.render("add-category", { userDetails: sessionUserDetails, success: '', errMsg: '', categoryList: result});
          })
    } else {
        res.redirect("/admin-login");
    }
})

router.post("/", [
    check('categoryName', "Category name should be 4 character long").isLength({ min: 4 })
], function (req, res, next) {

    var sessionUserDetails = req.session.userDetails;
    var creator = sessionUserDetails._id;
    var categoryName = req.body.categoryName;

    var date = moment().format('LLL');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let err = errors.mapped();

        for (errorMsg in err) {
            return res.render("add-category", { errMsg: err[errorMsg].msg, userDetails: sessionUserDetails, success: '', categoryList: '' });
        }
    } else {
        categoryModel.aggregate([{
            $match : {
                $and: [ 
                    {category: categoryName}, 
                    {'author.id': creator}, 
                ]
            }
        }]).exec(function(err, result){
            if (err) {
                console.log(err);
            }
            if(result.length!=0){
                res.render("add-category", { errMsg: 'Entered category already exist', userDetails: sessionUserDetails, success: '', categoryList: '' });
            } else {
                var categoryInstance = new categoryModel({
                    author: {
                        id: creator,
                        name: sessionUserDetails.username,
                    },
                    category: categoryName,
                    date: date,
                });
                categoryInstance.save(function (err, result) {
                    console.log(result)
                    if (err) throw err;
                    res.redirect("add-category");
                })
            }
        })
    }
})


module.exports = router;