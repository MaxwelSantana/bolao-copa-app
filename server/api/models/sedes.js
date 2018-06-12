var mongoose = require( 'mongoose' );

var sedeSchema = new mongoose.Schema({
    sede_id : Number, 
    nome_popular : String, 
    tipo : {
        tipo_id : Number, 
        descricao : String
    }, 
    nome : String
});

mongoose.model('Sede', sedeSchema);