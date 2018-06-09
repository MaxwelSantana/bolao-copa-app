const express = require('express');
const bodyParser= require('body-parser');
const {ObjectId} = require('mongodb'); 
const MongoClient = require('mongodb').MongoClient
const app = express();
var async = require("async");
var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.get('/equipes', function(req, res) {
    db.collection("equipes").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/fases', function(req, res) {
    db.collection("fases").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/jogos', function(req, res) {
    db.collection("jogos").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.put('/jogos', function(req, res) {
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

    db.collection("palpites").find(filterPalpites).toArray((err, palpites) => {
        if (err) throw err;
        
        async.map(jogos, function(jogo, callback) {
            let palpitesByJogo = palpites.filter(p => p.jogo_id == jogo.jogo_id);
            //return callback(null, null);
            db.collection('jogos').save(Object.assign(jogo, { _id: ObjectId(jogo._id), finalizado: true}), function(err, result) {
                return async.map(palpitesByJogo, function(palpite, callback) {
                    let placar_correto = false;
                    let resultado_correto = false;
                    let resultado_errado = false;
                    
                    if(palpite.placar_mandante == jogo.placar_oficial_mandante && palpite.placar_visitante == jogo.placar_oficial_visitante) {
                        placar_correto = true;
                    } else if( jogo.placar_oficial_mandante > jogo.placar_oficial_visitante && palpite.placar_mandante > palpite.placar_visitante 
                        || jogo.placar_oficial_mandante < jogo.placar_oficial_visitante && palpite.placar_mandante < palpite.placar_visitante 
                        || jogo.placar_oficial_mandante == jogo.placar_oficial_visitante && palpite.placar_mandante == palpite.placar_visitante ) {
                        resultado_correto = true;
                    } else {
                        resultado_errado = true;
                    }

                    Object.assign(palpite, { placar_correto, resultado_correto, resultado_errado });

                    return db.collection('palpites').save(palpite, callback);
                }, callback);
            });
        }, done);

    });

    
});

function checkFases() {
    db.collection("fases").find({}).toArray(function(err, fases) {
        if (err) throw err;
        
        let faseAtual = fases.find(fase => fase.atual);

        let query = {
            "fase_id": faseAtual.fase_id,
            "finalizado": false
        };

        db.collection("jogos").findOne(query, function(err, jogo){
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
        db.collection("jogos").find({fase_id:faseAtual.fase_id}).toArray(function(err, jogos) {
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
        db.collection("jogos").find({fase_id:faseAtual.fase_id}).toArray(function(err, jogos) {
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

                    db.collection("fases").updateOne( {fase_id: terceiroLugarFase.fase_id}, { $set: { atual: true, chaves: terceiroLugarFase.chaves } }, function(err, res) {
                        if (err) throw err;
                        console.log("1 document updated");
                    });

                    break;
            }
        });
    }

    db.collection("fases").updateOne( {fase_id: faseAtual.fase_id}, { $set: { finalizado: true, atual: false } }, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
    });

    db.collection("fases").updateOne( {fase_id: proximaFase.fase_id}, { $set: { atual: true, chaves: proximaFase.chaves } }, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
    });
}

function updateJogoEquipes(jogo_id, mandante, visitante) {
    let equipes = { $set:
        {
            equipe_mandante_id: mandante,
            equipe_visitante_id: visitante
        }
    };
    db.collection("jogos").updateOne( {jogo_id}, equipes, function(err, res) {
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

app.get('/sedes', function(req, res) {
    db.collection("sedes").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/users', (req, res) => {
    getNextSequence( "usuario_id", function(err, usuario_id){
        if(!err){
            const usuario = Object.assign(req.body, { usuario_id });
            db.collection('usuarios').save(usuario, (err, result) => {
                if (err) return console.log(err)
            
                console.log('saved to database');
                res.send('null');
                res.status(201).end();
            });
        }
    });
});

app.get('/usuarios/:id/palpites', (req, res) => {
    const usuario_id = parseInt(req.params.id);
    db.collection("palpites").find({ usuario_id }).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

app.get('/palpites', (req, res) => {
    db.collection("palpites").find({}).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.put('/palpites', (req, res) => {
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

    async.map(palpites, function(palpite, callback) {
        return db.collection('palpites').save(Object.assign(palpite, { _id: ObjectId(palpite._id)}), callback);
    }, done);
    
});

app.post('/palpites', (req, res) => {
    getNextSequence("palpite_id", function(err, palpite_id){
        if(!err){
            const palpite = Object.assign(req.body, { palpite_id });
            db.collection('palpites').save(palpite, (err, result) => {
                if (err) return console.log(err)
            
                console.log('saved to database');
                res.send('null');
                res.status(201).end();
            });
        }
    });
});

function getNextSequence(name, callback) {
    db.collection("counters").findAndModify( { _id: name }, null, { $inc: { seq: 1 } }, function(err, result){
        if(err) callback(err, result);
        callback(err, result.value.seq);
    } );
}

MongoClient.connect("mongodb://localhost:27017/", (err, client) => {
    if (err) return console.log(err)
    db = client.db('bolao-app-db');
    app.listen(3000, () => {
      console.log('listening on 3000');
    });
});

