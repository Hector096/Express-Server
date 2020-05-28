var LocalStrategy = require("passport-local").Strategy,
    bcrypt = require("bcryptjs");

// Load User Model
var User = require("../models/user");

module.exports = function(passport) {
    passport.use(new LocalStrategy({ usernameField: "email" }, function(username, password, done) {
        // Match user
        User.findOne({ email: username }, function(error, user) {
            if (error) {
                return console.log(error);
            }
            if (!user) {
                return done(null, false, { message: "Invalid Email" });
            }
            // Match password
            bcrypt.compare(password, user.password, function(error, isMatch) {
                if (error) throw error;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Invalid Password" });
                }
            });
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(error, user) {
            done(error, user);
        });
    });
};