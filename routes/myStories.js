var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
const {ensureAuthenticated} = require('../controllers/auth');

var event = require('../controllers/events');
var story = require('../controllers/stories');

var Story = require('../models/story');

/* Search My stories page. */
router.post('/MyStories/Search', story.search);

/* GET My stories page. */
router.get('/MyStories', ensureAuthenticated, story.getAll);

/* Delete a story */
router.post('/MyStories/deleteStory/:id', ensureAuthenticated, story.delete);

/* get edit story page. */
router.get('/MyStories/editStory/:id', ensureAuthenticated, function (req, res, next) {

    //checks if the user is logged in
    if (res.locals.login = req.isAuthenticated()) {
        var username = req.user.email;
        var firstname = req.user.firstname;
        var surname = req.user.surname;
    }

    //gets the ID of the story that has been selected for editing
    var storyid = req.params.id;

    //cast the story ID to object an object ID
    var mongo = require('mongodb');
    var o_id = new mongo.ObjectID(storyid);

    //find the story from the database with the matching object ID
    Story.find({'_id': o_id}).exec(function (err, story) {
        if (err)
            res.status(500).send('error ' + err);
        var storydata = story[0];
        if (storydata === undefined) {
            console.log("undefined error")
        } else {
            res.render('editStory', {
                username: username,
                firstname: firstname,
                surname: surname,
                stories: storydata,
                storyID: storyid
            });
        }
    })
});

/* edit a story */
router.post('/MyStories/editStory', ensureAuthenticated, story.edit);

module.exports = router;