var express = require('express');
var router = express.Router();
var session = require('express-session');
const userModel = require('../model/userRegister');

router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        var sessionUserDetails = req.session.userDetails;
        console.log("session Name"+ sessionUserDetails.username);
        res.render("admin-dashboard", {userDetails: sessionUserDetails});
        
    } else {
        res.redirect("/admin-login");
    }

});
router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect("/admin-login");
});
module.exports = router;