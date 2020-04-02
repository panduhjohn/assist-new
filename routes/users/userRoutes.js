const express = require('express')
const router = express.Router()
const passport = require('passport')

const userValidation = require('../users/utils/userValidation')
const userController = require('./controllers/userController')
const {updatePassword, updateProfile} = require('../users/controllers/userController')

const User = require('./models/User')

require('../../lib/passport')

router.get('/', userController.renderIndex)

router.get('/login', userController.renderLogin)
router.post('/login', userController.login)

router.get('/register', userController.renderRegister)
router.post('/register', userValidation, userController.register)

router.get('/homepage', userController.renderHomepage)

router.get('/profile', userController.renderProfile)

router.get('/options', userController.renderOptions)

router.get('/thanks', userController.renderThanks)

router.get('/update-profile', userController.renderUpdateProfile);

router.put('/update-profile', (req, res, next) => {
    userController.updateProfile(req.body, req.user._id)
        .then(user => {
            return res.redirect('/api/users/thanks');
        })
        .catch(err => {
            console.log(err);
            return res.redirect('/api/users/update-profile');
        });
});

router.put('/update-password', (req, res) => {
    userController.updatePassword(req.body, req.user._id)
        .then(user => {
            console.log('update route');
            return res.redirect('/api/users/thanks');
        })
        .catch(err => {
            console.log('pass route');
            return res.redirect('/api/users/update-profile');
        });
});


module.exports = router
