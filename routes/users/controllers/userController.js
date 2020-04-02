const { validationResult } = require('express-validator');
const faker = require('faker');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

require('../../../lib/passport');
require('dotenv').config();

const medical = require('../../../lib/medLoader');
const law = require('../../../lib/policeLoader');

module.exports = {
    renderIndex: (req, res, next) => {
        return res.render('index');
    },

    renderRegister: (req, res) => {
        return res.render('auth/register', { errors: req.flash('errors') });
    },

    register: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    // return req.flash('errors', 'User already exists');
                    return res.send('User Exists');
                } else {
                    const newUser = new User();

                    newUser.name = req.body.name;
                    newUser.picture = faker.image.avatar();
                    newUser.email = req.body.email;
                    newUser.password = req.body.password;

                    newUser
                        .save()
                        .then(user => {
                            req.login(user, err => {
                                if (err) {
                                    return res.status(400).json({
                                        confirmation: false,
                                        message: err
                                    });
                                } else {
                                    return res.redirect('/api/users/profile');
                                    // next();
                                }
                            });
                        })
                        .catch(err => {
                            return next(err);
                        });
                }
            })
            .catch(err => console.log(err));
    },

    renderLogin: (req, res) => {
        return res.render('auth/login', { errors: req.flash('errors') });
    },

    login: passport.authenticate('local-login', {
        successRedirect: '/api/users/profile',
        failureRedirect: '/api/users/login',
        failureFlash: true
    }),

    renderHomepage: (req, res) => {
        if (req.isAuthenticated()) {
            return res.render('main/homepage');
        }
        return res.redirect('/users/login');
    },

    renderProfile: (req, res) => {
        console.log('renderprofile', req.user);
        if (req.isAuthenticated()) {
            return res.render('auth/profile');
        }
        return res.redirect('/api/users/login');
    },

    renderUpdateProfile: (req, res) => {
        if (req.isAuthenticated()) {
            return res.render('auth/updateProfile');
        }
        return res.redirect('/api/users/login');
    },

    updateProfile: (params, id) => {
        // const {name, email, address} = params //if you want to destructure remove params from the code after the clg(hello)
        return new Promise((resolve, reject) => {
            User.findById(id)
                .then(user => {
                    // console.log('hello');
                    if (params.name) user.name = params.name;
                    if (params.email) user.email = params.email;
                    if (params.address) user.address = params.address;
                    if (params.city) user.city = params.city;
                    if (params.state) user.state = params.state;
                    if (params.credentials)
                        user.credentials = params.credentials;
                    if (params.organization)
                        user.organization = params.organization;
                    return user;
                })
                .then(user => {
                    user.save().then(user => {
                        resolve(user);
                    });
                })
                .catch(err => reject(err));
        }).catch(err => reject(err));
    },

    updatePassword: (params, id) => {
        return new Promise((resolve, reject) => {
            User.findById(id).then(user => {
                if (
                    !params.oldPassword ||
                    !params.newPassword ||
                    !params.repeatNewPassword
                ) {
                    reject('All password inputs must be filled');
                } else if (params.newPassword !== params.repeatNewPassword) {
                    reject('New passwords do not match');
                } else {
                    bcrypt
                        .compare(params.oldPassword, user.password)
                        .then(result => {
                            if (result === false) {
                                reject('Old password incorrect');
                            } else {
                                console.log('Did it save?');
                                user.password = params.newPassword;
                                user.save()
                                    .then(user => {
                                        resolve(user);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        throw new Error(
                                            'Error in passwords',
                                            err
                                        );
                                    });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            throw new Error('Error in passwords', err);
                        });
                }
            });
        });
    },

    renderOptions: (req, res) => {
        if (req.isAuthenticated()) {
            return res.render('main/options', { medical, law });
        }
        return res.redirect('/api/users/login');
    },

    renderThanks: (req, res) => {
        return res.render('auth/thanks');
    }
};
