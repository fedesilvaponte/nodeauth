var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated,  function(req, res, next) {
  res.render('index', { title: 'Members' });
});

router.post('/api', function (req, res) {
    var obj = {
      url: 'https://360-staging.autodesk.com/viewer'
    };
  res.send(JSON.stringify(obj));
});

function ensureAuthenticated(req, res, next) {
   if(req.isAuthenticated()) {
       return next();
   } else {
       res.redirect('/users/login');
   }
}

module.exports = router;
