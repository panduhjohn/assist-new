const express = require('express');
const router = express.Router();
const passport = require('passport');

const userValidation = require('../users/utils/userValidation');
const industryController = require('../industry/controllers/industryControllers');

const { updatePassword, updateProfile } = require('../users/controllers/userController');

const Industry = require('./models/Industry');

require('../../lib/passport');

router.get('/', industryController.renderIndex);

router.get('/login', industryController.renderLogin);
router.post(
  '/login',
  passport.authenticate('industry-login', {
    successRedirect: '/api/industry/options',
    failureRedirect: '/api/industry/login',
    failureFlash: true
  })
);

router.get('/register', industryController.renderRegister);
router.post('/register', userValidation, industryController.register);

router.get('/homepage', industryController.renderHomepage);

router.get('/profile', industryController.renderProfile);

router.get('/options', industryController.renderOptions);

router.get('/update-profile', industryController.renderUpdateProfile);

router.put('/update-profile', (req, res, next) => {
  userController
    .updateProfile(req.body, req.user._id)
    .then(user => {
      return res.redirect('/api/users/thanks');
    })
    .catch(err => {
      console.log(err);
      return res.redirect('/api/users/update-profile');
    });
});

router.put('/update-password', (req, res) => {
  userController
    .updatePassword(req.body, req.user._id)
    .then(user => {
      console.log('update route');
      return res.redirect('/api/users/thanks');
    })
    .catch(err => {
      console.log('pass route');
      return res.redirect('/api/users/update-profile');
    });
});

router.get('/medical', industryController.renderMedical)
router.get('/fire', industryController.renderFire)
router.get('/law', industryController.renderLaw)

router.get('/details/:user', industryController.renderDetails)


module.exports = router;
