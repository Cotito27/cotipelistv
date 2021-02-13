const express = require("express");
const router = express.Router();

const homeController = require('../controllers/home.controller');
const peliculaController = require('../controllers/peliculas.controller');
const serieController = require('../controllers/series.controller');
const trailerController = require('../controllers/trailer.controller');

router.get('/', homeController.index);
router.get('/getSerie', homeController.getSerie);
router.get('/peliculas', peliculaController.index);
router.get('/peliculas/:page', peliculaController.index);
router.get('/series', serieController.index);
router.get('/series/:page', serieController.index);
router.get('/findPeliculas/:page', peliculaController.find);
router.get('/findSeries/:page', serieController.find);
router.get('/pelicula/:id', peliculaController.streamVideo);
router.get('/serie/:id', serieController.streamVideo);
router.get('/serie/:id/temporada/:temporada/capitulo/:capitulo', serieController.episodeStream)
router.get('/searchVideo/:title', homeController.search);
router.get('/search/:title', homeController.searchDirect);
router.get('/generos/:genero', homeController.findByGenre);
router.get('/generos/:genero/:type', homeController.findTypeGenre)
router.get('/getFindGenre/:page', homeController.getFindGenre);
router.get('/getFindGenreType/:page/:type', homeController.getFindGenreType);
router.get('/year/:year', homeController.findByYear);
router.get('/getFindYear/:page', homeController.getFindYear);
router.get('/getFindYearType/:page/:type', homeController.getFindYearType);
router.get('/year/:year/:type', homeController.findTypeYear);
router.get('/getTrailer/:search', trailerController.index)

// router.get('/:page', homeController.index);

module.exports = { router };
