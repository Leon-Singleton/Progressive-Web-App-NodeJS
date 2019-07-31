const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const Image = new mongoose.Schema({
    _id: {
        type:String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    image: {
        type: Buffer,
        required: true
    }
});

const EventModel = mongoose.model('Image', Image);

module.exports = EventModel;