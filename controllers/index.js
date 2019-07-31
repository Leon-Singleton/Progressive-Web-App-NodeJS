var Event = require('../models/event');
var Story = require('../models/story');
var Image = require('../models/image');

/**
 * renders the index page with either the stories or events depending on the users
 * filter selection, sorts them in order of most recently posted
 * @param req the request object
 * @param res the response object
 */
exports.getIndex = function (req, res) {
    if (res.locals.login = req.isAuthenticated()) {
        var username = req.user.email;
        var firstname = req.user.firstname;
        var surname = req.user.surname;
    }

    //gets the state of the filterby field
    var filterby = req.body.selectpicker;
    console.log(filterby);

    //allows user to filter by event or story
    if (filterby == "Event" || "undefined") {
        Event.find({}).sort({startdate: -1}).exec(function (err, events) {
            if (err) throw err;
            res.render('index', {
                username: username,
                firstname: firstname,
                surname: surname,
                "events": events,
                "stories": []
            });
        })
    } else {
        Story.find({}).sort({startdate: -1}).exec(function (err, stories) {
            if (err)
                res.status(500).send('error ' + err);
            res.render('index', {
                username: username,
                firstname: firstname,
                surname: surname,
                "stories": stories,
                "events": []
            });
        })
    }
};

/**
 * handles the searching of stories and events on the index page, taking into account
 * the filters specified by the user, renders the results in order of most recently posted
 * @param req the request object
 * @param res the response object
 */
exports.searchIndex = function (req, res) {

    //checks the user is logged in
    if (res.locals.login = req.isAuthenticated()) {
        var username = req.user.email;
        var firstname = req.user.firstname;
        var surname = req.user.surname;
    }
    var searchname = req.body.searchName;

    //uses regex to simulate searching using a SQL like query
    var find = '/';
    var re = new RegExp(find, 'g');
    var date = req.body.searchDatepicker.replace(re, '-');

    var filterby = req.body.selectpicker;

    //handles the searching of events and stories using a search query
    if (filterby == "Event") {
        Event.find({$or: [{eventname: {$regex: ".*" + searchname + ".*"}}]}).sort({startdate: -1}).exec(function (err, events) {
            if (err)
                res.status(500).send('error ' + err);
            res.render('index', {
                username: username,
                firstname: firstname,
                surname: surname,
                "events": events,
                "stories": []
            });
        })
    } else {
        Story.find({$or: [{storyname: {$regex: ".*" + searchname + ".*"}}]}).sort({dateposted: -1}).exec(function (err, stories) {
            if (err)
                res.status(500).send('error ' + err);
            res.render('index', {
                username: username,
                firstname: firstname,
                surname: surname,
                "stories": stories,
                "events": []
            });
        })
    }
};

/**
 * gets all of the stories associated with an event and renders them in a new webpage for the
 * user to view
 * @param req the request object
 * @param res the response object
 */
exports.viewStories = function (req, res) {
    if (res.locals.login = req.isAuthenticated()) {
        var username = req.user.email;
        var firstname = req.user.firstname;
        var surname = req.user.surname;
    }

    console.log("getting stories")
    //get ID of event in order to find its associated stories
    var eventname = req.params.id;

    console.log(eventname)

    //gets all stories that contain the event id reference selected
    Story.find({eventname: eventname}).sort({startdate: -1}).exec(function (err, stories) {
        if (err)
            res.status(500).send('error ' + err);
        console.log(stories)
        res.render('viewStories', {
            username: username,
            firstname: firstname,
            surname: surname,
            "stories": stories,
            eventname: eventname
        });
    })
};

exports.getImage = function(res,req,image_id) {

    Image.findOne({_id: image_id}).exec(function(err, image) {
        if (err) {
            res.status(500).send('error ' + err);

        }

        res.contentType(image.contentType);
        res.send(image.image)

    })
};