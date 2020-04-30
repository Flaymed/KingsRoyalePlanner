const express = require('express');
const router = express.Router();
// use res.render to load up an ejs view file

router.get('/', function(req, res) {
  res.render("pages/index");
});


module.exports = router
