var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    title: 'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'Login'
  });
});

router.post('/register', function(req, res, next) {
  //get form values
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  //check for image field
  if(req.files && req.files.profileimage) {
    console.log('uploading file...');
    var profileImageOriginalName = req.files.profileimage.originalname;
    var profileImageName = req.files.profileimage.name;
    var profileImageMime = req.files.profileimage.mimetype;
    var profileImagePath = req.files.profileimage.path;
    var profileImageSize = req.files.profileimage.size;
  } else {
    // Set the default image
    var profileImageName = 'noimage.png';
  }

  // Form Validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email field should be a valid email').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  //check for errors
  var errors = req.validationErrors();
  if(errors) {
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2
    });
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileImage: profileImageName
    });

    //create user
    User.createUser(newUser, function (err, user) {
      if(err) { throw err; }
      console.log(user);
    });

    //success message
    req.flash('success', 'You are now register and may log in');
    res.location('/');
    res.redirect('/');
  }
});

//sessiones
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
      done(err, user);
  });
});

passport.use(new LocalStrategy(function (username, password, done) {
  User.getUserByUsername(username, function (err, user) {
    if(err) {throw err;}
    if(!user) {
      console.log('Unknown user');
      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, function (err, isMatch) {
      if(err) { throw err; }
      if(isMatch) {
        return done(null, user);
      } else {
        console.log('Invalid Password');
        return done(null, false, {message: 'Invalid Password'});
      }

    });

  });
}));

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  failureFlash: 'Invalid username or password'
}), function (req, res) {
  console.log('Authentication successfull');
  req.flash('success', 'You are logged in');
  res.redirect('/');
});

router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You have logged out');
    res.redirect('/users/login');
});

module.exports = router;
