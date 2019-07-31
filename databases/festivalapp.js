var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var bcrypt = require('bcryptjs');

// DB Config
//const db = require('./config/keys').MongoURI;
const db = 'mongodb://localhost:27017/festivalapp';

// Connect to MongoDB
mongoose
    .connect(
        db,
        {useNewUrlParser: true}
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));