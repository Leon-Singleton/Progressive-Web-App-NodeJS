var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
const {ensureAuthenticated} = require('../controllers/auth');
var fs = require('fs');
var multer = require('multer');

//require associated controller logic
var event = require('../controllers/events');
var story = require('../controllers/stories');
var index = require('../controllers/index');

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({storage: storage});

/* GET home page. */
router.get('/index', index.getIndex);

/* Redirect to index page. */
router.get('/', function (req, res, next) {
    res.redirect('/index');
});

/* Search indexpage. */
router.post('/index/Search', index.searchIndex);

/* Handles post request when creating stories */
router.post('/index/createStory', upload.array('myFiles', 12), (req, res, next) => {

    var images = [];
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
    req.body.img = images;
    story.insert(req, res);
});

/* GET create event page. */
router.get('/index/createEvent', ensureAuthenticated, function (req, res, next) {

    //checks if the user is logged in
    if (res.locals.login = req.isAuthenticated()) {
        var username = req.user.email;
        var firstname = req.user.firstname;
        var surname = req.user.surname;
    }

    var username = req.user.email;
    var firstname = req.user.firstname;
    var surname = req.user.surname;

    res.render('addEvent', {username: username, firstname: firstname, surname: surname});
});

/* GET event json. */
router.get('/index/events', function (req, res, next) {

    event.getAllEvents(req, res);
});

router.get('/index/stories', function (req, res, next) {

    story.getAllStories(req, res);
});


/* Handles post requests when creating events */
router.post('/index/createEvent', upload.array('myFiles', 12), (req, res, next) => {

    //checks if the user is logged in
    if (res.locals.login = req.isAuthenticated()) {
        var username = req.user.email;
        var firstname = req.user.firstname;
        var surname = req.user.surname;
    }

    var images = [];
    //if(req.files == null) {
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
    req.body.img = images;

    event.insert(req, res);
});

/* Redirect to take image page. */
router.get('/takeImage', function (req, res, next) {
    res.render('webrtc');
});

/* Post to upload the user's captured picture to mongoDB. */
router.post('/uploadpicture_app',
    function (req, res) {
        var userId= req.body.userId;
        var newString = new Date().getTime();
        targetDirectory = './private/images/' + userId + '/';
        if (!fs.existsSync(targetDirectory)) {
            fs.mkdirSync(targetDirectory);
        }
        console.log('saving file ' + targetDirectory + newString);

        // strip off the data: url prefix to get just the base64-encoded bytes
        var imageBlob = req.body.imageBlob.replace(/^data:image\/\w+;base64,/,
            "");
        var buf = new Buffer(imageBlob, 'base64');
        fs.writeFile(targetDirectory + newString + '.png', buf);
        var filePath = targetDirectory + newString;
        console.log('file saved!');
        var data = {user: userId, filePath: filePath};
        var errX = pictureDB.insertImage(data);
        if (errX) {
            console.log('error in saving data: ' + err);
            return res.status(500).send(err);
        } else {
            console.log('image inserted into db');
        }
        res.end(JSON.stringify({data: ''}));
});

/* GET create story page. */
router.get('/index/images/:id', function (req, res, next) {

    var image_id = req.params.id;
    //var image_id = "0.8rr9ijgk99m1558040813035"

    index.getImage(res,req,image_id);

});

module.exports = router;