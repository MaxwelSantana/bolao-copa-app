var mongoose = require( 'mongoose' );

var faseSchema = new mongoose.Schema({
  fase_id : Number, 
  proxima_fase_id : Number, 
  slug : String, 
  edicao_id: Number,
  ordem : Number, 
  data_fim : String, 
  tipo : {
        tipo_id : Number, 
        descricao : String
  }, 
  nome : String, 
  formato : {
    descricao : String, 
    formato_id : Number
  }, 
  data_inicio : String, 
  atual : Boolean, 
  disclaimer : String, 
  grupos : [
    {
        grupo_id : Number, 
        nome_grupo : String, 
        equipes : [Number]
    }
  ],
  chaves: [],
  finalizado : Boolean
});

mongoose.model('Fase', faseSchema);