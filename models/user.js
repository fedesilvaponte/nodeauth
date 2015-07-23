var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/nodeauth');
var db = mongoose.connection;

// User Schema

var UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  username: {
    type: String,
    index: true
  },
  password: {
    type: String,
    bcrypt: true,
    required: true
  },
  profileImage: {
    type: String
  }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByUsername = function (username, callback) {
  var query = {username: username};
  User.findOne(query, callback);
};

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

module.exports.comparePassword = function (candidate, hash, callback) {
    bcrypt.compare(candidate, hash, function(err, isMatch) {
        if(err) { return callback(err); }
        callback(null, isMatch);
    });
};

module.exports.createUser = function (newUser, callback) {
  bcrypt.hash(newUser.password, 10, function (err, hash) {
    if(err) { throw err; }
    newUser.password = hash;
    newUser.save(callback);
  });
};
