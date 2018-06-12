var mongoose = require( 'mongoose' );

var counterSchema = new mongoose.Schema({
    _id: String,
    seq: Number
});

counterSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};

counterSchema.statics.increment = function (counter, callback) {
  return this.collection.findAndModify({ _id: counter }, [], { $inc: { seq: 1 } }, callback);
};

mongoose.model('Counter', counterSchema);