var Event = require('../models/event');
var Story = require('../models/story');
var Image = require('../models/image');
var fs = require('fs');

/**
 * inserts the contents of the event insert form into the database
 * @param req the request object
 * @param res the response object
 */
exports.insert = function (req, res) {

    //gets the data from the request object
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }

    console.log(userData.eventStartDate);

    try {

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

        //creates a new object containing the form input data
        var event = new Event({
            username: userData.eventUsername,
            firstname: userData.eventFirstname,
            surname: userData.eventSurname,
            eventname: userData.eventName,
            startdate: userData.eventStartDate,
            enddate: userData.eventEndDate,
            description: userData.eventDescription,
            location: userData.eventLocation,
            city: userData.eventCity,
            postcode: userData.eventPostcode,
            img: image_ids
        });
        console.log('received: ' + event);

        //Insert images
        Image.insertMany(images, function(err) {
            if (err)
                res.status(500).send('Invalid data!' + err);
        });

        //inserts the new event object into the database
        event.save(function (err, results) {
            if (err)
                res.status(500).send('Invalid data!' + err);
        });

        req.flash('success_msg', 'Event successfully created, refresh to see changes');
        res.redirect('/myEvents');
        window.location.reload();
    } catch (e) {
        res.status(500).send('error ' + e);
    }
    //  }
};

/**
 * gets all of the events associated with a user and renders them
 * @param req the request object
 * @param res the response object
 */
exports.getAll = function (req, res) {

    //checks if the user is logged in
    if (res.locals.login = req.isAuthenticated()) {
        var username = req.user.email;
        var firstname = req.user.firstname;
        var surname = req.user.surname;
    }

    //retrieves all events from the database related to the logged in user, sorts them
    //in descending order
    Event.find({username: username}).sort({startdate: -1}).exec(function (err, events) {
        if (err)
            res.status(500).send('error ' + err);
        console.log(events);
        res.render('myEvents', {username: username, firstname: firstname, surname: surname, "events": events});
    })
};

exports.getAllEvents = function (req, res) {

    //checks if the user is logged in
    if (res.locals.login = req.isAuthenticated()) {
        var username = req.user.email;
        var firstname = req.user.firstname;
        var surname = req.user.surname;
    }

    //retrieves all events from the database related to the logged in user, sorts them
    //in descending order
    Event.find().sort({startdate: -1}).exec(function (err, events) {
        if (err)
            res.status(500).send('error ' + err);
        res.json(events)
    })
};


/**
 * handles event search requests made by the user and renders the results
 * @param req the request object
 * @param res the response object
 */
exports.search = function (req, res) {

    //checks if the user is logged in
    if (res.locals.login = req.isAuthenticated()) {
        var username = req.user.email;
        var firstname = req.user.firstname;
        var surname = req.user.surname;
    }

    //gets the search request from the request object
    var searchname = req.body.searchName;

    //uses regex to simulate a SQL like query
    var find = '/';
    var re = new RegExp(find, 'g');
    var date = req.body.searchDatepicker.replace(re, '-');

    //retrieves events that are similar to the search phrase
    Event.find({$or: [{eventname: {$regex: ".*" + searchname + ".*"}}]}).sort({startdate: -1}).exec(function (err, events) {
        if (err)
            res.status(500).send('error ' + err);
        res.render('myEvents', {username: username, firstname: firstname, surname: surname, "events": events});
    })

};

/**
 * deletes a specified event that a user has selected to delete,
 * removes all associated stories too
 * @param req the request object
 * @param res the response object
 */
exports.delete = function (req, res) {

    //configuration for getting associated image paths
    var path = require('path');
    var fs = require('fs');

    //get the ID of the event
    var eventID = req.params.id;

    //Delete associated stories
    Story.deleteMany({event: eventID}).exec(function (err, stories) {
        if (err)
            res.status(500).send('error ' + err);
    });


    //Delete events
    Event.deleteOne({_id: eventID}).exec(function (err, event) {
        if (err)
            res.status(500).send('error ' + err);
        req.flash('success_msg', 'Event successfully deleted, refresh to see changes');
        res.redirect('/myEvents');
    })
}

/**
 * edits the specified event that a user has selected to edit
 * @param req the request object
 * @param res the response object
 */
exports.edit = function (req, res) {

    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }

    /*//Add new images
    Event.findById(userData.eventID).exec(function (err, event) {
        if (err)
            res.status(500).send('error ' + err);
    });
    var images = [];
    var image_ids_to_add = [];
    userData.img.forEach(function (img) {
        var image_id = Math.random().toString(36)+Date.now();
        let image = new Image({
            _id:image_id,
            contentType: img.contentType,
            image: img.image,
        });
        images.push(image)
        image_ids_to_add.push(image_id)
    });

    //Remove selected images
    //////////////////////
    var image_ids_to_delete = []

    //Ensure image ids to delete are in a array
    if(typeof userData.deleteImages  == "string") {
        image_ids_to_delete.push(userData.deleteImages);
    } else {
        image_ids_to_delete = userData.deleteImages;
    }

    image_ids_to_delete.forEach(function(img_id){
        Image.deleteOne({_id: img_id}).exec(function (err, img) {
            if (err)
                res.status(500).send('error ' + err);
        });
    });
*/

    //update event
    Event.updateOne({_id: userData.eventID}, {
        $set: {
            username: userData.eventUsername,
            firstname: userData.eventFirstname,
            surname: userData.eventSurname,
            eventname: userData.newEventName,
            startdate: new Date(userData.eventStartDate),
            enddate: new Date(userData.eventStartDate),
            description: userData.eventDescription,
            location: userData.eventLocation,
            city: userData.eventCity,
            postcode: userData.eventPostcode,
        }
    })

        .exec(function (err, results) {

            if (err)
                res.status(500).send('Invalid data!' + err);
        });
    
    //update stories containing old event name with new one
    Story.updateMany({eventname: userData.oldEventName}, {
        $set: {eventname: userData.newEventName}
    })
        .exec(function (err, results) {

            if (err)
                res.status(500).send('Invalid data!' + err);
            console.log("stories updated!")
        });
    req.flash('success_msg', 'Event successfully edited, refresh to see changes');
    res.redirect('/myEvents');
    window.location.reload();
};

exports.getImage = function(res,req,event_id,img_id) {

    //retrieve event
    Event.findOne({_id: event_id}).exec(function (err, event) {
        if (err)
            res.status(500).send('error ' + err);

        var img = event.img.find(function(img) {
            return img._id = img_id;
        });

        res.contentType(img.contentType);
        res.send(img.image)
    })
};