var mongoose = require('mongoose');

var equipeSchema = new mongoose.Schema({
    genero : String, 
    nome : String,
    equipe_id : Number, 
    sigla : String, 
    nome_popular : String, 
    slug : String
});

mongoose.model('Equipe', equipeSchema);