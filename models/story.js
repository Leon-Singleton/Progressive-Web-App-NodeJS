const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const Story = new mongoose.Schema({
    event: {
        type: ObjectId,
        ref: 'Event'
    },
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
    img: {
        type: [String]
    },
    eventname: {
        type: String,
        required: true
    },
    storyname: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    dateposted: {
        type: Date,
        required: true
    }
});

const StoryModel = mongoose.model('Story', Story);

module.exports = StoryModel;