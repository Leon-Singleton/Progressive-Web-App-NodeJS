var Event = require('../models/event');
var Story = require('../models/story');

/**
 * renders the map by getting all of the events and stories currently stored in the database
 * and for each one plotting a map marker on the Google Map
 * @param req the request object
 * @param res the response object
 */
exports.initiateMap = function (req, res) {

    //checks if the user is logged in
    if (res.locals.login = req.isAuthenticated()) {
        var username = req.user.email;
        var firstname = req.user.firstname;
        var surname = req.user.surname;
    }

    //find all events and stories that have address information in order to plot them on map
    Event.find({}).sort({startdate: -1}).exec(function (err, events) {
        if (err)
            res.status(500).send('error ' + err);
        Story.find({latitude: {$exists: true, $ne: ""}}).sort({startdate: -1}).exec(function (err, stories) {
            if (err)
                res.status(500).send('error ' + err);
            res.render('eventsMap', {
                username: username,
                firstname: firstname,
                surname: surname,
                stories: stories,
                events: events
            });
        })
    })

};