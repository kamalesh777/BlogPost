var express = require('express');
var router = express.Router();
var moment = require("moment");
const { check, validationResult } = require('express-validator');

const userModel = require('../model/userRegister');
var passport = require('passport');

passport.use(userModel.createStrategy());

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

router.get('/', function (req, res, next) {
    res.render("admin-register", { errMsg: '' })
});

router.post('/', [
    check('username', 'Username should be 4 character long').isLength(4),
    check('email').isEmail(),
    check('gender', 'Select a gender type').isLength(1),
    check('password', 'Password should be 4 character long ').isLength(4).custom((value, { req }) => {
        if (value !== req.body.cPassword) {
            throw new Error('Password confirmation does not match password');

        }
        return true;
    })
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let err = errors.mapped();

        for (errorMsg in err) {
            return res.render("admin-register", { errMsg: err[errorMsg].msg });
        }
    } else {
        var date = moment().format('LLL');
        var userDetails = {
            username: req.body.username,
            email: req.body.email,
            gender: req.body.gender,
            date: date,
        }
        userModel.register(userDetails, req.body.password, function (err, user) {
            if (err) {
                res.render("admin-register", { errMsg: err.message });
            } else {
                passport.authenticate('local')(req, res, function () {
                    req.session.userDetails = user;
                    res.redirect("/admin-dashboard")
                })
            }
        })
    }
})


module.exports = router;
