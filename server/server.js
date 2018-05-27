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

