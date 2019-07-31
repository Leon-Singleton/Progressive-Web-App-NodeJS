var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
const {ensureAuthenticated} = require('../controllers/auth');

//require the map controller logic
var eventsMap = require('../controllers/eventsMap');

/* GET Events map page. */
router.get('/EventsMap', eventsMap.initiateMap);

module.exports = router;