var mongoose = require('mongoose');
var Sede = mongoose.model('Sede');

module.exports.getAll = function(req, res) {
    Sede
      .find({})
      .exec(function(err, sedes) {
        res.status(200).json(sedes);
      });
};