var express = require("express"),
    router = express.Router(),
    bcrypt = require("bcryptjs"),
    passport = require("passport");

// Load User Model
var User = require("../models/user");
var { forwardAuthenticated } = require('../config/auth');

// Register Form
router.get("/register", forwardAuthenticated, function(request, response) {
    response.render("register");
});

// Login Form
router.get("/login", forwardAuthenticated, function(request, response) {
    response.render("login");
});

// Register User
router.post("/register", function(request, response) {
    var { name, email, password, password2 } = request.body;
    let errors = [];

    if (!name) {
        errors.push({ msg: "Please enter your name" });
    }

    if (!email) {
        errors.push({ msg: "Please enter email" });
    }

    if (!password) {
        errors.push({ msg: "Please enter password" });
    }

    if (!password2) {
        errors.push({ msg: "Please confirm password" });
    }

    if (password != password2) {
        errors.push({ msg: "Passwords do not match" });
    }

    if (password.length < 6) {
        errors.push({ msg: "Password must be at least 6 character long" });
    }

    if (errors.length > 0) {
        response.render("register", { errors, name, email, password, password2 });
    } else {
        User.findOne({ email: email }, function(error, user) {
            if (user) {
                errors.push({ msg: "Email already registered" });
                response.render("register", { errors, name, email, password, password2 });
            } else {
                var newUser = new User({ name, email, password });
                bcrypt.genSalt(10, function(error, salt) {
                    bcrypt.hash(newUser.password, salt, function(error, hash) {
                        if (error) throw error;
                        newUser.password = hash;
                        newUser.save(function(error, user) {
                            if (error) {
                                return console.log(error);
                            }
                            request.flash("success_msg", "You're successfully registered. Log in to continue");
                            response.redirect("/users/login");
                        });
                    });
                });
            }
        });
    }
});

// Login User
router.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/users/login",
    failureFlash: true
}), function(request, response) {
    response.redirect("/home");
});

// Logout User
// router.get("/logout", function(request, response) {
//     request.logout();
//     request.flash("success_msg", "You're successfully logged out");
//     response.redirect("/users/login");
// });
router.get("/logout", function(request, response) {
    request.logout();
    response.redirect("/");
});

module.exports = router;