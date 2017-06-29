var db = require('../libs/database');

exports.logs = function(req, res, next) {
  db.getLogs(req.session.user_id, function(e, docs) {
    if(e) return next(e);
    res.json(docs);
  });
};
