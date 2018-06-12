var mongoose = require( 'mongoose' );

var palpiteSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    usuario_id : mongoose.Schema.Types.ObjectId, 
    jogo_id : String, 
    placar_mandante : Number, 
    placar_visitante : Number, 
    equipe_mandante_id : Number, 
    equipe_visitante_id : Number, 
    grupo_id : Number, 
    alterado : Boolean,
    placar_correto: Boolean,
    resultado_correto: Boolean,
    resultado_errado: Boolean
});

mongoose.model('Palpite', palpiteSchema);