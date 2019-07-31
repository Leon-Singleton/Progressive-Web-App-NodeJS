var Event = require('../models/event');
var Story = require('../models/story');
var Image = require('../models/image');

/**
 * inserts the contents of the stories insert form into the database
 * and associates it with the corresponding event
 * @param req the request object
 * @param res the response object
 */
exports.insert = function (req, res) {

    //gets all the data from the request object
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }

    var images = [];
    var image_ids = [];
    userData.img.forEach(function (img) {
        var image_id = Math.random().toString(36)+Date.now();
        let image = new Image({
            _id:image_id,
            contentType: img.contentType,
            image: img.image,
        });
        images.push(image)
        image_ids.push(image_id)
    });

    //creates an object using all of the data from the request object
    try {
        var today = new Date().getTime();
        var story = new Story({
            event: userData.eventID,
            username: userData.storyUsername,
            firstname: userData.storyFirstname,
            surname: userData.storySurname,
            eventname: userData.eventName,
            storyname: userData.storyName,
            description: userData.storyDescription,
            latitude: userData.storyLatitude,
            longitude: userData.storyLongitude,
            dateposted: new Date().getTime(),
            img: image_ids
        });
        console.log('received: ' + story);

        //Insert images
        Image.insertMany(images, function(err) {
            if (err)
                res.status(500).send('Invalid data!' + err);
        });

        story.save(function (err, results) {
            if (err)
                res.status(500).send('Invalid data!' + err);
        });
        req.flash('success_ msg', 'Story successfully created, refresh to see changes');
        res.redirect('/myStories');
        window.location.reload();
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};

/**
 * gets all of the stories in the database correspodnig to the given user
 * and renders them on the webpage
 * @param req the request object
 * @param res the response object
 */
exports.getAll = function (req, res) {

    //checks if the user is authenticated
    if (res.locals.login = req.isAuthenticated()) {
        var username = req.user.email;
        var firstname = req.user.firstname;
        var surname = req.user.surname;
    }

    //gets all of the stories corresponding to the logged in user and displays them in descending date order
    Story.find({username: username}).sort({startdate: -1}).exec(function (err, stories) {
        if (err) throw err;
        console.log(stories);
        res.render('myStories', {username: username, firstname: firstname, surname: surname, "stories": stories});
    })
};

exports.getAllStories = function (req, res) {

    //checks if the user is authenticated
    if (res.locals.login = req.isAuthenticated()) {
        var username = req.user.email;
        var firstname = req.user.firstname;
        var surname = req.user.surname;
    }

    //gets all of the stories corresponding to the logged in user and displays them in descending date order
    Story.find().sort({startdate: -1}).exec(function (err, stories) {
        if (err) throw err;
        res.json(stories);
    })

};
/**
 * allows a user to search their stories, rendering the results of the webpage
 * @param req the request object
 * @param res the response object
 */
exports.search = function (req, res) {

    //checks to see if the current user is authenticated
    if (res.locals.login = req.isAuthenticated()) {
        var username = req.user.email;
        var firstname = req.user.firstname;
        var surname = req.user.surname;
    }

    //gets the search query from the request object
    var searchname = req.body.searchName;

    //uses regex to simulate searhing the database using a SQL like query
    var find = '/';
    var re = new RegExp(find, 'g');
    var date = req.body.searchDatepicker.replace(re, '-');

    //searches the database for all the stories matching the search query
    Story.find({$or: [{storyname: {$regex: ".*" + searchname + ".*"}}]}).sort({dateposted: -1}).exec(function (err, stories) {
        if (err)
            res.status(500).send('error ' + err);
        res.render('myStories', {username: username, firstname: firstname, surname: surname, "stories": stories});
    })

};

/**
 * deletes the story that the user has selected to delete
 * @param req the request object
 * @param res the response object
 */
exports.delete = function (req, res) {

    //gets the ID of the story to delete
    var id = req.params.id;

    //deletes the story mathcing the ID of the story selected for deletion
    Story.remove({_id: id}).exec(function (err, stories) {
        if (err)
            res.status(500).send('error ' + err);
        req.flash('success_msg', 'Event successfully deleted, refresh to see changes');
        res.redirect('/myStories');
    })
};

/**
 * edits the contents of a story that the user has selected to edit using the values
 * entered into the edit story form
 * @param req the request object
 * @param res the response object
 */
exports.edit = function (req, res) {
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    var id = userData.storyID;
    console.log(id);

    //cast to object id
    var mongo = require('mongodb');
    var o_id = new mongo.ObjectID(id);

    //update event using it's associated object ID
    Story.updateOne({_id: o_id}, {
        $set: {
            username: userData.storyUsername,
            firstname: userData.storyFirstname,
            surname: userData.storySurname,
            eventname: userData.eventName,
            storyname: userData.storyName,
            description: userData.storyDescription,
            latitude: userData.storyLatitude,
            longitude: userData.storyLongitude,
        }
    })
        .exec(function (err, results) {

            if (err)
                res.status(500).send('Invalid data!' + err);
            console.log("record updated!")
        });
    req.flash('success_msg', 'Event successfully edited, refresh to see changes');
    res.redirect('/myStories');
    window.location.reload();
};

