var express = require('express');
var router = express.Router();
var multer = require('multer');
var _ = require('lodash');
const path = require("path");
const { check, validationResult } = require('express-validator');
var moment = require("moment");
var filter = require("./imageFilter");
var postModel = require("../model/uploadschema");
const userModel = require('../model/userRegister');
var categoryModel = require("../model/categorySchema");

var findPost = postModel.find({});

var uniqueSuffix = "";
var storage = multer.diskStorage({
  destination: "./public/post-image",
  filename: function (req, file, cb) {
    var d = new Date();
    var n = d.getSeconds();
    uniqueSuffix = file.fieldname+n + '-' + file.originalname;
    cb(null, uniqueSuffix)
  }
})
var upload = multer({ storage: storage, fileFilter: filter.imageFilter });

router.get('/:id', function (req, res, next) {
    if (req.isAuthenticated()) {
       
      var sessionUserDetails = req.session.userDetails;
      categoryModel.find({"author.id": sessionUserDetails._id}).exec(function(err, data){
        // console.log(data);
        res.render("new-post", {userDetails: sessionUserDetails, categoryList: data, errMsg:'', success:''});
      })
  } else {
      res.redirect("/admin-login");
  }
});

router.post('/:id', upload.single("uploadFile"), [
  check('headingTitle', "Title should be 4 character long").isLength({ min: 4 }),
  check('category', "Select minimum one category").notEmpty(),
  check('postContent', "Title should be 20 character long").isLength({ min: 20 }),
  

], function (req, res, next) {
  
  var sessionUserDetails = req.session.userDetails;
  var userId = req.params.id;
  var publishBy = sessionUserDetails.username;
  var hTitle = req.body.headingTitle;
  var pContent = req.body.postContent;
  var hidcategories = (req.body.hiddencategory).split(',');
//   console.log(hidcategories);
  var date = moment().format('LLL');
  // console.log(postArray);
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let err = errors.mapped();
        console.log(err);
        for (errorMsg in err) {
            return res.render("new-post", { errMsg: err[errorMsg].msg, userDetails: sessionUserDetails, success: ''});
        }
    } else {
      var postInstance = new postModel({
        author : {
          id : userId,
          name : publishBy
        },
        title: hTitle,
        imageUrl: uniqueSuffix,
        content: pContent,
        categories: hidcategories,
        comments: [{ cName: '', body: '', date: date }],
        date: date,
        publish: false,
        meta: {
            votes: 0,
            favs:  0
          }
      })
      postInstance.save(function (err, data) {
        if (err) throw err;
        res.redirect("/")
        // res.render('index', { title: 'Home', lodash: _, articles: data});
      })
    }

});


module.exports = router;
