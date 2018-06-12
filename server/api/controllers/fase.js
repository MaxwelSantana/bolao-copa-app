var mongoose = require('mongoose');
var Fase = mongoose.model('Fase');

module.exports.getAll = function(req, res) {
    Fase
      .find({})
      .exec(function(err, fases) {
        res.status(200).json(fases);
      });
};