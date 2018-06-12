var mongoose = require('mongoose');
var Palpite = mongoose.model('Palpite');
var Counter = mongoose.model('Counter');
var async = require("async");

module.exports.getAll = function(req, res) {
    Palpite
      .find({})
      .exec(function(err, palpites) {
        res.status(200).json(palpites);
      });
};

module.exports.saveMany = function(req, res) {
    const palpites = req.body;

    let callback = (err, result) => {
        if (err) return console.log(err)
        console.log("salvo");
        return "result"
    };

    let done = (err, results) => {
        if (err) throw err
        res.send('null');
        res.status(204).end();
    };

    async.map(palpites, function(p, callback) {
        if (!p._id) {
            p._id = new mongoose.mongo.ObjectID();
        }

        console.log("TESTE", p);
        return Palpite.findByIdAndUpdate(p._id, p , { upsert: true },function (err) {
            if (err) throw err
            callback();
        });
    }, done);
}