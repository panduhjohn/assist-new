const { validationResult } = require('express-validator');
const faker = require('faker');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const Industry = require('../models/Industry');

require('../../../lib/passport');

require('dotenv').config();

const medical = require('../../../lib/medLoader');
const law = require('../../../lib/policeLoader');
const fire = require('../../../lib/fireLoader');

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
        Industry.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    // return req.flash('errors', 'User already exists');
                    return res.send('User Exists');
                } else {
                    const newIndustry = new Industry();

                    newIndustry.name = req.body.name;
                    newIndustry.email = req.body.email;
                    newIndustry.password = req.body.password;
                    newIndustry.picture = faker.image.avatar();

                    newIndustry
                        .save()
                        .then(user => {
                            req.login(user, err => {
                                if (err) {
                                    return res.status(400).json({
                                        confirmation: false,
                                        message: err
                                    });
                                } else {
                                    return res.render('main/options', {
                                        user: req.user,
                                        medical,
                                        law,
                                        fire
                                    });
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

    login: passport.authenticate('industry-login', {
        successRedirect: '/api/industry/options',
        failureRedirect: '/api/industry/login',
        failureFlash: true
    }),

    renderHomepage: (req, res) => {
        if (req.isAuthenticated()) {
            return res.render('main/homepage');
        }
        return res.redirect('/users/login');
    },

    renderProfile: (req, res) => {
        if (req.isAuthenticated()) {
            return res.render('auth/profile');
        }
        return res.redirect('/api/users/login');
    },

    renderUpdateProfile: (req, res) => {
        if (req.isAuthenticated()) {
            return res.render('auth/updateProfileIndustry');
        }
        return res.redirect('/api/users/login');
    },

    updateProfile: (params, id) => {
        // const {name, email, address} = params //if you want to destructure remove params from the code after the clg(hello)
        return new Promise((resolve, reject) => {
            Industry.findById(id)
                .then(user => {
                    // console.log('hello');
                    if (params.name) user.name = params.name;
                    if (params.email) user.email = params.email;
                    if (params.address) user.address = params.address;
                    if (params.city) user.city = params.city;
                    if (params.state) user.state = params.state;
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
            Industry.findById(id).then(user => {
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
        return res.render('main/options', { medical, law, fire });
    },

    renderMedical: (req, res) => {
        return res.render('main/medical', { medical });
    },
    renderFire: (req, res) => {
        return res.render('main/fire', { fire });
    },
    renderLaw: (req, res) => {
        return res.render('main/law', { law });
    },

    renderDetails: (req, res) => {
        return res.render('main/memberDetails', { medical, law, fire })
    }
};
