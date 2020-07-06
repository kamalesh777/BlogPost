var express = require('express');
var router = express.Router();
const userModel = require('../model/userRegister');
const passport = require('passport');

router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect("/admin-dashboard");
    } else {
        res.render("admin-login", {errMsg: ''});
    }
});
router.post('/', (req, res, next) => {
    req.session.loggedIn = true;
    var username = req.body.username;
    userModel.findOne({username: username}).exec((err, result) => {
        if (result) {
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    console.log(err);
                }
                if (!user) {
                    res.render("admin-login", {validationErr : info, errMsg: info.message});
                }
                req.login(user, function(err){
                    req.session.userDetails = result;
                    res.redirect("/admin-dashboard");
                })
            })(req, res, next);
        } else {
            res.render("admin-login", {errMsg: "Username does not exits try different"});
        }
    })
    
})


module.exports = router;