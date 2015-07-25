var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth');

/* GET home page. */
router.get('/', auth.ensureAuthenticated,  function(req, res, next) {
  res.render('index', { title: 'Members' });
});


module.exports = router;
