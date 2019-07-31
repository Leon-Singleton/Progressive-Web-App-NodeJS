/**
 * Module dependencies.
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var expressValidator = require('express-validator');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var myStoriesRouter = require('./routes/myStories');
var myEventsRouter = require('./routes/myEvents');
var viewStoriesRouter = require('./routes/viewStories');
var eventsMapRouter = require('./routes/eventsMap');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var multer = require('multer');

var port = process.env.PORT || 8000;

//We tried to make it work but, we found a better way to upload an image
io.on('connection', function (socket) {
    console.log('an user connected');

    socket.on('upload-image', function (message) {
        var writer = fs.createWriteStream(path.resolve(__dirname, 'public/uploads/' + message.id), {encoding: 'base64'});
        writer.write(message.data);
        writer.end();
        writer.on('finish', function () {

            if (message.oldImgPath != "") {
                fs.unlinkSync(path.join(__dirname + "/public/" + message.oldImgPath));
            }
            socket.emit('image-uploaded', {id: path.join('/uploads/' + message.id)});
        });
    });

    socket.on('ferret', function (name, fn) {
        fn('woot');
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});
// Passport controller
require('./controllers/passport')(passport);

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());


// Connect flash
app.use(flash());

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    next();
});

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(passport.session({secret: 'max', saveUninitialized: false, resave: false}));
// app.use(session({secret: 'max', saveUninitialized: false, resave: false}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', myEventsRouter);
app.use('/', myStoriesRouter);
app.use('/', viewStoriesRouter);
app.use('/', eventsMapRouter);
app.use('/users', usersRouter);

// npm multer app method requirements
app.post('/profile', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
});

app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
});

var cpUpload = upload.fields([{name: 'avatar', maxCount: 1}, {name: 'gallery', maxCount: 8}]);
app.post('/cool-profile', cpUpload, function (req, res, next) {
    // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
    //
    // e.g.
    //  req.files['avatar'][0] -> File
    //  req.files['gallery'] -> Array
    //
    // req.body will contain the text fields, if there were any
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
