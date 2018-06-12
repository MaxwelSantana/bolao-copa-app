var mongoose = require( 'mongoose' );

var jogoSchema = new mongoose.Schema({
    escalacao_mandante_id : Number, 
    equipe_mandante_id : Number, 
    vencedor_jogo : Number, 
    suspenso : Boolean, 
    rodada : Number, 
    wo : Boolean, 
    hora_realizacao : String, 
    escalacao_visitante_id : Number, 
    placar_oficial_visitante : Number, 
    equipe_visitante_id : Number, 
    placar_penaltis_visitante : Number, 
    decisivo : Boolean, 
    jogo_id : String, 
    placar_penaltis_mandante : Number, 
    cancelado : Boolean, 
    sede_id : Number, 
    placar_oficial_mandante : Number, 
    data_realizacao : String, 
    fase_id : Number, 
    grupo_id : Number, 
    finalizado : Boolean
});

mongoose.model('Jogo', jogoSchema);