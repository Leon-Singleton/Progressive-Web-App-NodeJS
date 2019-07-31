const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const Event = new mongoose.Schema({
    stories: [{
        type: ObjectId, ref: 'Story'
    }],
    username: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    eventname: {
        type: String,
        required: true
    },
    startdate: {
        type: String,
        required: true
    },
    enddate: {
        type: String,

        required: true
    },
    img: {
        type: [String]
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postcode: {
        type: String,
        required: true
    },
});

const EventModel = mongoose.model('Event', Event);

module.exports = EventModel;