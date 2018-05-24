const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();
var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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

app.post('/quotes', (req, res) => {
    console.log(req.body);
    db.collection('quotes').save(req.body, (err, result) => {
        if (err) return console.log(err)
    
        console.log('saved to database');
        res.redirect('/');
    });
})

MongoClient.connect("mongodb://localhost:27017/", (err, client) => {
    if (err) return console.log(err)
    db = client.db('bolao-app-db');
    app.listen(3000, () => {
      console.log('listening on 3000');
    });
});

