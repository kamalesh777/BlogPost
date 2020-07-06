var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var multer = require('multer');
var _ = require('lodash');
var moment = require("moment");
const path = require("path");
const fs = require("fs");

var postModel = require("../model/uploadschema");
var userModel = require("../model/userRegister");
var catModel = require("../model/categorySchema");

const directoryPath = path.join(__dirname, '../public/post-image/');

//Upload Image Function for Edit Post
var uniqueSuffix = "";
var storage = multer.diskStorage({
  destination: "./public/post-image",
  filename: function (req, file, cb) {
    var d = new Date();
    var n = d.getSeconds();
    uniqueSuffix = file.fieldname + n + '-' + file.originalname;
    cb(null, uniqueSuffix)
  }
})
var upload = multer({ storage: storage });


router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    var sessionUserDetails = req.session.userDetails;
    let _id = sessionUserDetails._id;

    postModel.find({ "author.id": _id }).exec(function (err, result) {
      if (err) throw err;
      if (result) {
        res.render("view-post", { userDetails: sessionUserDetails, postData: result });
      }
    })
  } else {
    res.redirect("/admin-login");
  }
});

router.get("/delete-post/:id", function (req, res) {
  if (req.isAuthenticated) {
    let deleteId = req.params.id;
    postModel.findByIdAndDelete({ _id: deleteId }).exec(function (err, data) {
      if (err) throw err;
      res.redirect("/view-post");
    })
  } else {
    res.redirect("/");
  }
})

//GET EDIT POST
//========================================

router.get("/edit-post/:image/:id", function (req, res) {
  if (req.isAuthenticated) {
    
    //make the previoust edited image name with undefined
    uniqueSuffix = "";
    
    var sessionUserDetails = req.session.userDetails;
    let editId = req.params.id;
    catModel.find({ 'author.id': sessionUserDetails._id }).exec(function (err, allCategory) {
      postModel.findById({ _id: editId }).exec(function (err, data) {
        if (err) throw err;
        var catArray = [];

        allCategory.forEach(function (cat) {
          catArray.push(cat.category);
        })
        res.render("edit-post", { userDetails: sessionUserDetails, result: data, categoryList: data.categories, allCategories: allCategory, errMsg: '', success: '' })
      })
    })
  } else {
    res.redirect("/admin-login");
  }
})

//POST EDIT POST
//========================================
router.post('/edit-post/:image/:id', upload.single("uploadFile"), [
  check('headingTitle', "Title should be 4 character long").isLength({ min: 4 }),
  check('category', "Select minimum one category").notEmpty(),
  check('postContent', "Title should be 20 character long").isLength({ min: 20 }),


], function (req, res, next) {
    var sessionUserDetails = req.session.userDetails;
    var userId = sessionUserDetails._id;
    var paramId = req.params.id;
  // console.log(paramId)

  catModel.find({ 'author.id': sessionUserDetails._id }).exec(function (err, allCategory) {
    postModel.findById({ '_id': paramId }).exec(function (err, result) {
      var catArray = [];

      allCategory.forEach(function (cat) {
        catArray.push(cat.category);
      })
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let err = errors.mapped();
        console.log(err);
        for (errorMsg in err) {
          return res.render("edit-post", { errMsg: err[errorMsg].msg, userDetails: sessionUserDetails, success: '', categoryList: result.categories, allCategories: allCategory, result: result });
        }
      } else {
        var publishBy = sessionUserDetails.username;
        var hTitle = req.body.headingTitle;
        var pContent = req.body.postContent;
        var hidcategories = (req.body.hiddencategory).split(',');
        var date = moment().format('LLL');

        //previous Image value
        var oldImage = req.params.image;
        const deleteImage = directoryPath + oldImage;
        var newImage = uniqueSuffix;
        
        var imageChange = newImage != '' ? newImage : oldImage;
        // console.log("HI GUYS " + imageChange);

        var findPostId = postModel.findByIdAndUpdate({ _id: paramId }, {
          author: {
            id: userId,
            name: publishBy
          },
          title: hTitle,
          imageUrl: imageChange,
          content: pContent,
          categories: hidcategories,
          comments: [{ cName: '', body: '', date: date }],
          date: date,
          publish: false,
          meta: {
            votes: 0,
            favs: 0
          }
        }).exec(function (err, edited) {
          if (err) throw err;
          if (newImage != '' && newImage != oldImage) {
            fs.unlink(deleteImage, function (err) {
              if (err) {
                throw err
              } else {
                // console.log("Successfully deleted the file. "+ oldImage)
              }
            })
          }
          res.redirect("/");
        })
      }
    })
  })
});

module.exports = router;
