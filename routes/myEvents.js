var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
const {ensureAuthenticated} = require('../controllers/auth');
var multer = require('multer');
var fs = require('fs');


//requires the controller logic function
var event = require('../controllers/events');
var story = require('../controllers/stories');

var Event = require('../models/event');

// SET STORAGE for images
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({storage: storage});

/* get My events page. */
//router.get('/MyEvents', ensureAuthenticated, event.getAll);

/* GET myEvents. */
router.get('/MyEvents', ensureAuthenticated, function (req, res, next) {

    //checks if the user is logged in
    if (res.locals.login = req.isAuthenticated()) {
        var username = req.user.email;
        var firstname = req.user.firstname;
        var surname = req.user.surname;
    }

    res.render('myEvents', {username: username, firstname: firstname, surname: surname});
});

/* get edit event page. */
router.get('/MyEvents/editEvent/:id', ensureAuthenticated, function (req, res, next) {

    //checks if the user is logged in
    if (res.locals.login = req.isAuthenticated()) {
        var username = req.user.email;
        var firstname = req.user.firstname;
        var surname = req.user.surname;
    }

    var eventID = req.params.id;

    //Get the details of the event the user has selected to edit using it's ID
    Event.findById(eventID, function (err, event) {
        if (err)
            res.status(500).send('error ' + err);

        res.render('editEvent', {username: username, firstname: firstname, surname: surname, event: event});
    });
});

/* Search My events page. */
router.post('/MyEvents/Search', ensureAuthenticated, event.search);

/* Delete an event */
router.post('/myEvents/deleteEvent/:id', ensureAuthenticated, event.delete);

/* GET create story page. */
router.get('/myEvents/createStory/:id', ensureAuthenticated, function (req, res, next) {

    //checks if the user is logged in
    if (res.locals.login = req.isAuthenticated()) {
        var username = req.user.email;
        var firstname = req.user.firstname;
        var surname = req.user.surname;
    }

    //renders a new page where a user can create a story, associates the new story
    //with the event ID of the event that the user selected to add a story for
    var eventID = req.params.id;
    Event.findById(eventID, function (err, event) {
        if (err)
            res.status(500).send('error ' + err);
        res.render('addStory', {username: username, firstname: firstname, surname: surname, event: event});
    });
});

/* GET create story page. */
router.get('/myEvents/images/', function (req, res, next) {

/*    var event_id = req.params.id;
    var img = req.params.img;*/
    var event_id = '5cdd90b36bdea73988e96137';
    var img = '"5cdd90b36bdea73988e96138"'

    event.getImage(res,req,event_id,img);

});

/* add an event */
router.post('/MyEvents', ensureAuthenticated, event.insert);

/* edit an event */
//router.post('/MyEvents/editEvent', ensureAuthenticated, event.edit);

router.post('/MyEvents/editEvent', upload.array('myFiles', 12), function (req, res, next) {

    var images = [];
    //if (req.files != null) {
    req.files.forEach(function (file) {

        //Handle Image upload
        var img = fs.readFileSync(file.path);
        var encode_image = img.toString('base64');

        //Define a JSONobject for the image attributes for saving to database
        var finalImg = {
            contentType: file.mimetype,
            image: new Buffer.from(encode_image, 'base64')
        };

        images.push(finalImg);
    });
    //}
    console.log(req.body.deleteImages);
    req.body.img = images;
    event.edit(req, res);
});


module.exports = router;