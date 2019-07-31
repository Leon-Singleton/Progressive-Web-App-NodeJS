const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

/**
 * passport functionality that handles the logging in of a user
 * returns success if valid login details or error message if not
 * @param passport the passport login object
 */
module.exports = function (passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            // Cheks to see if user is currently registered
            User.findOne({
                email: email
            }).then(user => {
                if (!user) {
                    return done(null, false, {message: 'That email is not registered'});
                }

                // Checks the entered password mathces the one hashed in the database
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'Password incorrect'});
                    }
                });
            });
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};
