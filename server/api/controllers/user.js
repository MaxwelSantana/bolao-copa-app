var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.getAll = function(req, res) {
  User
      .find({})
      .exec(function(err, users) {
        res.status(200).json(users);
      });
};