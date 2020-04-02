const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../routes/users/models/User');
const Industry = require('../routes/industry/models/Industry');

// this places the mongo user id into passport sessions
passport.serializeUser((user, done) => {
  done(null, user._id);
});

//this gives us out req.user to use throughout the app
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (user) {
      done(err, user);
    } else if (!user) {
      Industry.findById(id, (err, user) => {
        if (user) {
            done(err, user);
        }
      });
    }
  });
});

//create login middleware
// local-login names the middleware
passport.use(
  'local-login',
  //usernameField defaults to name, but we named it email. these fields are expected
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, email, password, done) => {
      //search for user
      console.log('hello local login');
      User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
          console.log('Login error: ', err);
          //return the error and no user
          return done(err, null);
        }
        if (!user) {
          console.log('No user found');
          return done(
            null,
            false,
            req.flash('errors', 'No user has been found')
          );
        }

        //unencrypt and compare password
        bcrypt
          .compare(password, user.password)
          .then(result => {
            if (!result) {
              return done(
                null,
                false,
                req.flash('errors', 'Check email or password')
              );
            } else {
              console.log('returning user');
              return done(null, user);
            }
          })
          .catch(err => {
            throw err;
          });
      });
    }
  )
);
//Industry
passport.use(
  'industry-login',
  //usernameField defaults to name, but we named it email. these fields are expected
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, email, password, done) => {
      //search for user
      console.log('hello industry');
      Industry.findOne({ email: req.body.email }, (err, user) => {
        console.log('find user in industry');
        if (err) {
          console.log('Login error: ', err);
          //return the error and no user
          return done(err, null);
        }
        if (!user) {
          console.log('No user found');
          return done(
            null,
            false,
            req.flash('errors', 'No user has been found')
          );
        }

        //unencrypt and compare password
        bcrypt
          .compare(password, user.password)
          .then(result => {
            console.log('check result');
            if (!result) {
              console.log('no user');
              return done(
                null,
                false,
                req.flash('errors', 'Check email or password')
              );
            } else {
              console.log('end industry:', user);
              return done(null, user);
            }
          })
          .catch(err => {
            throw err;
          });
      });
    }
  )
);
