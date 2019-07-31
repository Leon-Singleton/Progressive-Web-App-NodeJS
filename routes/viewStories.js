var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
const {ensureAuthenticated} = require('../controllers/auth');

//require the controller logic
var story = require('../controllers/stories');
var index = require('../controllers/index');

/* GET view stories page. */
router.get('/viewStories/:id', function (req, res, next) {


    var event_id = req.params.id;
    res.render('viewStories', {event_id:event_id});

});

module.exports = router;