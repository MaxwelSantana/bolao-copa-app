var mongoose = require('mongoose');
var Jogo = mongoose.model('Jogo');
var Palpite = mongoose.model('Palpite');
var Fase = mongoose.model('Fase');
var async = require("async");

module.exports.getAll = function(req, res) {
    Jogo
      .find({})
      .exec(function(err, jogos) {
        res.status(200).json(jogos);
      });
};

module.exports.saveMany = function(req, res) {
  const jogos = req.body;
  const jogoIds = jogos.map(j => j.jogo_id);
  const filterPalpites = {jogo_id: {$in: jogoIds}};

  let callback = (err, result) => {   
      if (err) return console.log(err)
      console.log("result");
      return "result"
  };

  let done = (err, results) => {
      if (err) throw err
      checkFases();
      res.send('null');
      res.status(204).end();
  };

  Palpite.find(filterPalpites, (err, palpites) => {
      if (err) throw err;
      
      async.map(jogos, function(jogo, callback) {
        
          let palpitesByJogo = palpites.filter(p => p.jogo_id == jogo.jogo_id);
          jogo.finalizado = true;

          Jogo.update({_id: jogo._id}, jogo, {upsert: true},(err, savedJogo) => {

            return async.map(palpitesByJogo, function(palpite, callback) {
                  let placar_correto = false;
                  let resultado_correto = false;
                  let resultado_errado = false;
                  
                  if(palpite.placar_mandante == jogo.placar_oficial_mandante && palpite.placar_visitante == jogo.placar_oficial_visitante) {
                      placar_correto = true;
                  } else if( (jogo.placar_oficial_mandante > jogo.placar_oficial_visitante && palpite.placar_mandante > palpite.placar_visitante) 
                      || (jogo.placar_oficial_mandante < jogo.placar_oficial_visitante && palpite.placar_mandante < palpite.placar_visitante) 
                      || (jogo.placar_oficial_mandante == jogo.placar_oficial_visitante && palpite.placar_mandante == palpite.placar_visitante) ) {
                      resultado_correto = true;
                  } else {
                      resultado_errado = true;
                  }

                  //Object.assign(palpite, { placar_correto, resultado_correto, resultado_errado });
                  //palpite.placar_correto = placar_correto;
                  //palpite.resultado_correto = resultado_correto;
                  //palpite.resultado_errado = resultado_errado;
                  console.log("TESTE", { placar_correto, resultado_correto, resultado_errado });
                  return Palpite.update({_id: palpite._id}, { placar_correto, resultado_correto, resultado_errado }, {upsert: true}, (err, result) => {
                    if (err) throw err
                    callback();
                  });
              }, callback);
          });
      }, done);
  });

}

function checkFases() {
  Fase.find({}).exec(function(err, fases) {
    if (err) throw err;
      
    let faseAtual = fases.find(fase => fase.atual);

    let query = {
        "fase_id": faseAtual.fase_id,
        "finalizado": false
    };

    Jogo.findOne(query, function(err, jogo){
        if (err) throw err;

        if(!jogo)
            changeFase(faseAtual, fases);
    });      
  });
}

function changeFase(faseAtual, fases) {
    let proximaFase = fases.find(fase => fase.fase_id == faseAtual.proxima_fase_id);

    // Verifica fase de grupo
    if(faseAtual.tipo.tipo_id == 3) {
        Jogo.find({fase_id:faseAtual.fase_id}).exec(function(err, jogos) {
            let grupos = [].concat(faseAtual.grupos);
            grupos.forEach(grupo => {
                let jogosByGrupo = jogos.filter(jogo => jogo.grupo_id == grupo.grupo_id);
                const [classificado1, classificado2] = getClassificadosGrupo(grupo, jogosByGrupo).map(classificado => classificado.equipe_id);
                Object.assign(grupo, {classificado1, classificado2});
            });

            const [grupoA, grupoB, grupoC, grupoD, grupoE, grupoF, grupoG, grupoH] = grupos;

            proximaFase.chaves[0].equipe_1.equipe_id = grupoA.classificado1;
            proximaFase.chaves[0].equipe_2.equipe_id = grupoB.classificado2;
            updateJogoEquipes(proximaFase.chaves[0].jogo_1.jogo_id, grupoA.classificado1, grupoB.classificado2);
            
            proximaFase.chaves[1].equipe_1.equipe_id = grupoC.classificado1;
            proximaFase.chaves[1].equipe_2.equipe_id = grupoD.classificado2;
            updateJogoEquipes(proximaFase.chaves[1].jogo_1.jogo_id, grupoC.classificado1, grupoD.classificado2);

            proximaFase.chaves[2].equipe_1.equipe_id = grupoE.classificado1;
            proximaFase.chaves[2].equipe_2.equipe_id = grupoF.classificado2;
            updateJogoEquipes(proximaFase.chaves[2].jogo_1.jogo_id, grupoE.classificado1, grupoF.classificado2);

            proximaFase.chaves[3].equipe_1.equipe_id = grupoG.classificado1;
            proximaFase.chaves[3].equipe_2.equipe_id = grupoH.classificado2;
            updateJogoEquipes(proximaFase.chaves[3].jogo_1.jogo_id, grupoG.classificado1, grupoH.classificado2);

            proximaFase.chaves[4].equipe_1.equipe_id = grupoB.classificado1;
            proximaFase.chaves[4].equipe_2.equipe_id = grupoA.classificado2;
            updateJogoEquipes(proximaFase.chaves[4].jogo_1.jogo_id, grupoB.classificado1, grupoA.classificado2);

            proximaFase.chaves[5].equipe_1.equipe_id = grupoD.classificado1;
            proximaFase.chaves[5].equipe_2.equipe_id = grupoC.classificado2;
            updateJogoEquipes(proximaFase.chaves[5].jogo_1.jogo_id, grupoD.classificado1, grupoC.classificado2);

            proximaFase.chaves[6].equipe_1.equipe_id = grupoF.classificado1;
            proximaFase.chaves[6].equipe_2.equipe_id = grupoE.classificado2;
            updateJogoEquipes(proximaFase.chaves[6].jogo_1.jogo_id, grupoF.classificado1, grupoE.classificado2);

            proximaFase.chaves[7].equipe_1.equipe_id = grupoH.classificado1;
            proximaFase.chaves[7].equipe_2.equipe_id = grupoG.classificado2;
            updateJogoEquipes(proximaFase.chaves[7].jogo_1.jogo_id, grupoH.classificado1, grupoG.classificado2);

            faseAtual.finalizado = true;
            faseAtual.atual = false;
            proximaFase.atual = true;
        });

    } else {
        Jogo.find({fase_id:faseAtual.fase_id}).exec(function(err, jogos) {
            let vencedoresChaves = {};
            let derrotadosChaves = {};
            faseAtual.chaves.forEach(chave => {
                let jogoChave = jogos.find(j => j.jogo_id == chave.jogo_1.jogo_id);
                let equipeVencedoraChave = null;
                let equipeDerrotadaChave = null;

                if(jogoChave.placar_oficial_mandante > jogoChave.placar_oficial_visitante) {
                    equipeVencedoraChave = jogoChave.equipe_mandante_id;
                    equipeDerrotadaChave = jogoChave.equipe_visitante_id;
                }else if(jogoChave.placar_oficial_mandante < jogoChave.placar_oficial_visitante) {
                    equipeVencedoraChave = jogoChave.equipe_visitante_id;
                    equipeDerrotadaChave = jogoChave.equipe_mandante_id;
                }else {
                    if(jogoChave.placar_penaltis_mandante > jogoChave.placar_penaltis_visitante) {
                        equipeVencedoraChave = jogoChave.equipe_mandante_id;
                        equipeDerrotadaChave = jogoChave.equipe_visitante_id;
                    }else {
                        equipeVencedoraChave = jogoChave.equipe_visitante_id;
                        equipeDerrotadaChave = jogoChave.equipe_mandante_id;
                    }
                }

                vencedoresChaves[chave.nome] = equipeVencedoraChave;
                derrotadosChaves[chave.nome] = equipeDerrotadaChave;
            });

            switch(proximaFase.slug) {
                case "quartas-copa-do-mundo-2018":
                    proximaFase.chaves[0].equipe_1.equipe_id = vencedoresChaves["Oitavas 1"];
                    proximaFase.chaves[0].equipe_2.equipe_id = vencedoresChaves["Oitavas 2"];
                    updateJogoEquipes(proximaFase.chaves[0].jogo_1.jogo_id, vencedoresChaves["Oitavas 1"], vencedoresChaves["Oitavas 2"]);

                    proximaFase.chaves[1].equipe_1.equipe_id = vencedoresChaves["Oitavas 3"];
                    proximaFase.chaves[1].equipe_2.equipe_id = vencedoresChaves["Oitavas 4"];
                    updateJogoEquipes(proximaFase.chaves[1].jogo_1.jogo_id, vencedoresChaves["Oitavas 3"], vencedoresChaves["Oitavas 4"]);

                    proximaFase.chaves[2].equipe_1.equipe_id = vencedoresChaves["Oitavas 5"];
                    proximaFase.chaves[2].equipe_2.equipe_id = vencedoresChaves["Oitavas 6"];
                    updateJogoEquipes(proximaFase.chaves[2].jogo_1.jogo_id, vencedoresChaves["Oitavas 5"], vencedoresChaves["Oitavas 6"]);

                    proximaFase.chaves[3].equipe_1.equipe_id = vencedoresChaves["Oitavas 7"];
                    proximaFase.chaves[3].equipe_2.equipe_id = vencedoresChaves["Oitavas 8"];
                    updateJogoEquipes(proximaFase.chaves[3].jogo_1.jogo_id, vencedoresChaves["Oitavas 7"], vencedoresChaves["Oitavas 8"]);
                    
                    break;
                case "semifinal-copa-do-mundo-2018":
                    proximaFase.chaves[0].equipe_1.equipe_id = vencedoresChaves["Quartas 1"];
                    proximaFase.chaves[0].equipe_2.equipe_id = vencedoresChaves["Quartas 2"];
                    updateJogoEquipes(proximaFase.chaves[0].jogo_1.jogo_id, vencedoresChaves["Quartas 1"], vencedoresChaves["Quartas 2"]);

                    proximaFase.chaves[1].equipe_1.equipe_id = vencedoresChaves["Quartas 3"];
                    proximaFase.chaves[1].equipe_2.equipe_id = vencedoresChaves["Quartas 4"];
                    updateJogoEquipes(proximaFase.chaves[1].jogo_1.jogo_id, vencedoresChaves["Quartas 3"], vencedoresChaves["Quartas 4"]);

                    break;
                case "final-copa-do-mundo-2018":
                    proximaFase.chaves[0].equipe_1.equipe_id = vencedoresChaves["Semifinal 1"];
                    proximaFase.chaves[0].equipe_2.equipe_id = vencedoresChaves["Semifinal 2"];
                    updateJogoEquipes(proximaFase.chaves[0].jogo_1.jogo_id, vencedoresChaves["Semifinal 1"], vencedoresChaves["Semifinal 2"]);

                    let terceiroLugarFase = fases.find(fase => fase.fase_id == proximaFase.proxima_fase_id);

                    terceiroLugarFase.chaves[0].equipe_1.equipe_id = derrotadosChaves["Semifinal 1"];
                    terceiroLugarFase.chaves[0].equipe_2.equipe_id = derrotadosChaves["Semifinal 2"];
                    updateJogoEquipes(terceiroLugarFase.chaves[0].jogo_1.jogo_id, derrotadosChaves["Semifinal 1"], derrotadosChaves["Semifinal 2"]);

                    Fase.update({fase_id: terceiroLugarFase.fase_id}, { atual: true, chaves: terceiroLugarFase.chaves }, function(err, res) {
                        if (err) throw err;
                        console.log("1 document updated");
                    });

                    break;
            }
        });
    }

    Fase.update({fase_id: faseAtual.fase_id}, { finalizado: true, atual: false }, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
    });

    Fase.update({fase_id: proximaFase.fase_id}, { atual: true, chaves: proximaFase.chaves }, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
    });
}

function updateJogoEquipes(jogo_id, mandante, visitante) {
    let equipes = {
        equipe_mandante_id: mandante,
        equipe_visitante_id: visitante
    };
    Jogo.update({jogo_id}, equipes, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
    });
}

function getClassificadosGrupo(grupo, jogos) {
    const [id1, id2, id3, id4] = grupo.equipes;
    const pontuacaoVazia = {
        "jogos" : 0, 
        "vitorias" : 0, 
        "empates" : 0, 
        "derrotas" : 0, 
        "gols_pro" : 0, 
        "gols_contra" : 0
    };

    let equipes = [
        { equipe_id:id1, pontuacao: Object.assign({}, pontuacaoVazia) },
        { equipe_id:id2, pontuacao: Object.assign({}, pontuacaoVazia) },
        { equipe_id:id3, pontuacao: Object.assign({}, pontuacaoVazia) },
        { equipe_id:id4, pontuacao: Object.assign({}, pontuacaoVazia) }
    ];

    jogos.forEach(jogo => {
      let equipe_mandante = equipes.find(e => e.equipe_id == jogo.equipe_mandante_id);
      let equipe_visitante = equipes.find(e => e.equipe_id == jogo.equipe_visitante_id);

      updatePontuacao(equipe_mandante, jogo.placar_mandante, jogo.placar_visitante);
      updatePontuacao(equipe_visitante, jogo.placar_visitante, jogo.placar_mandante);
    });

    sortEquipes(equipes);

    return equipes.slice(0,2);
}

function sortEquipes(equipes) {
    equipes.sort((equipe1, equipe2) => {
        let result = getPontos(equipe2) - getPontos(equipe1);
        
        if(result == 0) {
            if(getSaldoGols(equipe1) < getSaldoGols(equipe2) ) return 1
            if(getSaldoGols(equipe1) > getSaldoGols(equipe2) ) return -1
            else {
                if(equipe1.pontuacao && equipe2.pontuacao && equipe1.pontuacao.gols_pro < equipe2.pontuacao.gols_pro) return 1
                if(equipe1.pontuacao && equipe2.pontuacao && equipe1.pontuacao.gols_pro > equipe2.pontuacao.gols_pro) return -1
                else {
                    if(equipe1.nome_popular < equipe2.nome_popular) return -1;
                    if(equipe1.nome_popular > equipe2.nome_popular) return 1;
                    return 0;
                }
            }
        }
        
        return result;
    });
}

function getPontos(equipe) {
    if(equipe.pontuacao)
        return ( equipe.pontuacao.vitorias * 3 ) + equipe.pontuacao.empates;
    return 0;
}

function getSaldoGols(equipe) {
    if(equipe.pontuacao)
        return equipe.pontuacao.gols_pro - equipe.pontuacao.gols_contra;
    return 0;
}

function updatePontuacao(equipe, placar, placar_adversario) {
    let { jogos, vitorias, derrotas, empates, gols_pro, gols_contra } = equipe.pontuacao;

    let result = placar - placar_adversario;

    Object.assign(equipe.pontuacao, {
      jogos: jogos + 1, 
      gols_pro: gols_pro + placar, 
      gols_contra: gols_contra + placar_adversario 
    });

    if(result > 0) {
      Object.assign(equipe.pontuacao, {vitorias: vitorias + 1});
    } else if (result < 0) {
      Object.assign(equipe.pontuacao, {derrotas: derrotas + 1});
    } else if (result == 0) {
      Object.assign(equipe.pontuacao, {empates: empates + 1});
    }

}