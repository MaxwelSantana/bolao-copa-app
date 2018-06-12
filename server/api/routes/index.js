var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlAuth    = require('../controllers/authentication');
var ctrlEquipe  = require('../controllers/equipe');
var ctrlFase    = require('../controllers/fase');
var ctrlJogo    = require('../controllers/jogo');
var ctrlPalpite = require('../controllers/palpite');
var ctrlProfile = require('../controllers/profile');
var ctrlSede    = require('../controllers/sede');
var ctrlUser    = require('../controllers/user');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.post('/profile/edit', auth, ctrlProfile.update);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// users
router.get('/users', ctrlUser.getAll);

// equipes
router.get('/equipes', ctrlEquipe.getAll);

// fases
router.get('/fases', ctrlFase.getAll);

// jogos
router.get('/jogos', ctrlJogo.getAll);
router.put('/jogos', ctrlJogo.saveMany);

// palpites
router.get('/palpites', ctrlPalpite.getAll);
router.put('/palpites', ctrlPalpite.saveMany);

// sedes
router.get('/sedes', ctrlSede.getAll);

module.exports = router;
