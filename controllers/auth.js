var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

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

module.exports.ensureAuthenticated = function (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/users/login');
    }
};
