var mongoose = require('mongoose');
var Equipe = mongoose.model('Equipe');

module.exports.getAll = function(req, res) {
    Equipe
      .find({})
      .exec(function(err, equipes) {
        res.status(200).json(equipes);
      });
};