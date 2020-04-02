const express = require('express');
const router = express.Router();
const passport = require('passport');
const faker = require('faker');
const { validationResult } = require('express-validator');

const User = require('./users/models/User');

/* GET home page. */
router.get('/', (req, res, next) => {
    return res.render('index');
});

//! Login Routes
router.get('/login', (req, res) => {
    return res.render('auth/login', { errors: req.flash('errors') });
});

router.post(
    '/login',
    passport.authenticate('local-login', {
        successRedirect: '/about',
        failureRedirect: '/',
        failureFlash: true
    })
);

router.get('/contact', (req, res) => {
    return res.render('main/contact');
});
router.get('/services', (req, res) => {
    return res.render('main/services');
});
router.get('/recommendations', (req, res) => {
    return res.render('main/recommendations');
});

router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    return res.redirect('/');
});

router.get('*', (req, res) => {
    return res.render('main/404')
})

module.exports = router;
