var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('^/|(events|music|art|happy-hour|contact)', function(req, res) {
  res.render('index', { title: 'The Maltese', basehref: req });
});

module.exports = router;
