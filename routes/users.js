const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
    const {firstname, surname, email, password, password2} = req.body;
    let errors = [];

    //validation for the registration input fields
    if (!firstname || !surname || !email || !password || !password2) {
        errors.push({msg: 'Please enter all fields'});
    }

    if (password != password2) {
        errors.push({msg: 'Passwords do not match'});
    }

    if (password.length < 6) {
        errors.push({msg: 'Password must be at least 6 characters'});
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            firstname,
            surname,
            email,
            password,
            password2
        });
    } else {
        //validate whether email already exists
        User.findOne({email: email}).then(user => {
            if (user) {
                errors.push({msg: 'Email already exists'});
                res.render('register', {
                    errors,
                    firstname,
                    surname,
                    email,
                    password,
                    password2
                });
            } else {
                //if all validation is passed new user is created
                const newUser = new User({
                    firstname,
                    surname,
                    email,
                    password
                });

                //hashes the user's password before storing it in the database
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err)
                            res.status(500).send('error ' + err);
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

// Login
router.post('/login', (req, res, next) => {
    //authentices the login of a user
    passport.authenticate('local', {
        successRedirect: '/MyEvents',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    //logs a user out of the webiste
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});

module.exports = router;
