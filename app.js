var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var memoryStore = session.MemoryStore;
var store = new memoryStore();
var db = require('./libs/database');
var nconf = require('nconf');
var async = require('async');
var helpers = require('./libs/helpers');

var routes = require('./routes');
var api = require('./routes/api');

var app = express();


app.set('store', store);

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser(nconf.get('SESSION_SECRET')));
app.use(session({
  store: store,
  secret: nconf.get('SESSION_SECRET'),
  saveUninitialized: true,
  resave: true,
  cookie: {maxAge: 31536000000}
}));
app.use(express.static(path.join(__dirname, 'public')));


if (app.get('env') !== 'development') {
  app.all('*', routes.force_https);
} else {
  app.all('*', routes.check_dev_token);
}


app.get('/', routes.ensureAuthenticated, routes.index);

app.get('/login', routes.login);
app.get('/logs/', routes.ensureAuthenticated, routes.logs);
app.get('/logs/api/', routes.ensureAuthenticated, api.logs);

app.get('/authorize/', routes.authorize);
app.get('/logout/', routes.logout);
app.get('/redirect/', routes.redirect);


app.post('/simulate/api/', routes.ensureAuthenticated, function(req, res, next) {
  if(!req.body.eventType) {
    var error = new Error('No event type sent');
    error.setStatus(403);
    return next(error);
  }
  if(req.body.eventType === 'trip') {
    var events = helpers.generateTrip();
    async.mapSeries(events, function(event, cb) {
      sendEvent(helpers.generateEvent(req.session.user_id, event.type, event.location));
      setTimeout(cb, event.delay);
    });
  } else {
    var event = helpers.generateEvent(req.session.user_id, req.body.eventType);
    sendEvent(event);
  }
  res.json({success: true});
});


app.post('/webhook/', function(req, res) {
  console.log('Incoming Webhook: ' + JSON.stringify(req.body));
  if(req.body) {
    sendEvent(req.body);
    db.saveLog(req.body);
    res.json({success: true});
  }
});


var automaticSocketURL = 'https://stream.automatic.com?token=' + nconf.get('AUTOMATIC_CLIENT_ID') + ':' + nconf.get('AUTOMATIC_CLIENT_SECRET');
var automaticSocket = require('socket.io-client')(automaticSocketURL);

automaticSocket.on('connect', function(){
  console.log('Automatic Websocket Connected');
});

automaticSocket.on('location:updated', function(data) {
  console.log('Incoming Location: ' + JSON.stringify(data));
  sendEvent(data);
});

automaticSocket.on('error', function(data){
  console.log('Automatic Websocket Error:', data);
});

automaticSocket.on('reconnecting', function(attemptNumber) {
  console.log('Automatic Websocket Reconnecting! - attempt ' + attemptNumber);
});

automaticSocket.on('reconnect_error', function (error) {
  console.log('Automatic Websocket Reconnection error!\n', error);
});

automaticSocket.on('reconnect', function (attemptNumber) {
  console.log('Automatic Websocket Reconnected on attempt ' + attemptNumber);
});

automaticSocket.on('disconnect', function(){
  console.log('Automatic Websocket Disconnected');
});


function sendEvent(event) {
  var wss = app.get('wss');
  wss.sendEvent(event);
}


// error handlers
require('./libs/errors')(app);

module.exports = app;
