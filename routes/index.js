var request = require('request'),
    nconf = require('nconf');

var oauth2 = require('simple-oauth2')({
  clientID: nconf.get('AUTOMATIC_CLIENT_ID'),
  clientSecret: nconf.get('AUTOMATIC_CLIENT_SECRET'),
  site: nconf.get('AUTOMATIC_ACCOUNTS_URL'),
  tokenPath: '/oauth/access_token'
});

var authorization_uri = oauth2.authCode.authorizeURL({
  scope: 'scope:trip scope:location scope:current_location scope:vehicle:profile scope:vehicle:events'
});


exports.index = function(req, res, next) {
  res.render('map', {mapboxAccessToken: nconf.get('MAPBOX_ACCESS_TOKEN')});
};


exports.login = function(req, res, next) {
  res.render('login');
};


exports.authorize = function(req, res, next) {
  res.redirect(authorization_uri);
};


exports.redirect = function(req, res, next) {
  var code = req.query.code;

  oauth2.authCode.getToken({
    code: code
  }, function(e, result) {
    if(e) return next(e);

    // Attach `token` to the user's session for later use
    var token = oauth2.accessToken.create(result);

    req.session.access_token = token.token.access_token;
    req.session.user_id = token.token.user.id;

    res.redirect('/');
  });
};


exports.logout = function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
};


exports.logs = function(req, res, next) {
  res.render('logs');
};


exports.force_https = function(req, res, next) {
  if(req.headers['x-forwarded-proto'] != 'https') {
    res.redirect('https://' + req.headers.host + req.path);
  } else {
    next();
  }
};


exports.ensureAuthenticated = function(req, res, next) {
  if (req.session && req.session.access_token) {
    return next();
  }

  if(req.xhr) {
    var error = new Error('Not logged in');
    error.setStatus(401);
    return next(error);
  } else {
    res.redirect('/login');
  }
};


exports.check_dev_token = function(req, res, next) {
  if(process.env.TOKEN) {
    req.session.access_token = process.env.TOKEN;
    req.session.user_id = process.env.USER_ID;
  }
  next();
};
