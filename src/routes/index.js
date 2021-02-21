const express = require("express");
const router = express.Router();
const passport = require('passport');

const homeController = require('../controllers/home.controller');
const peliculaController = require('../controllers/peliculas.controller');
const serieController = require('../controllers/series.controller');
const trailerController = require('../controllers/trailer.controller');
const successController = require('../controllers/success.controller');
const loginController = require('../controllers/login.controller');
const commentController = require('../controllers/comment.controller');
const watchlistController = require('../controllers/watchlist.controller');
const reactionController = require('../controllers/reaction.controller');
const videoExtendController = require('../controllers/videoextend.controller');

function validarUser(req, res, next) {
  // console.log(req.session);
  if (req.isAuthenticated()) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=1, pre-check=0');
  }
  req.session.redirectTo = req.path;
  next();
  // res.redirect("/error");
}

function validarUserRedirect(req, res, next) {
  if (req.isAuthenticated()) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=1, pre-check=0');
    return next();
  }
  res.redirect('/');
}


router.get('/', validarUser, homeController.index);
router.post("/verificarLogin", loginController.verify);
router.get('/getSerie', validarUser, homeController.getSerie);
router.get('/peliculas', validarUser , peliculaController.index);
router.get('/peliculas/:page', validarUser, peliculaController.index);
router.get('/series', validarUser, serieController.index);
router.get('/series/:page', validarUser, serieController.index);
router.get('/findPeliculas/:page', peliculaController.find);
router.get('/findSeries/:page', serieController.find);
router.get('/pelicula/:id', validarUser, peliculaController.streamVideo);
router.get('/serie/:id', validarUser, serieController.streamVideo);
router.get('/serie/:id/temporada/:temporada/capitulo/:capitulo', validarUser, serieController.episodeStream)
router.get('/searchVideo/:title', validarUser, homeController.search);
router.get('/search/:title', validarUser, homeController.searchDirect);
router.get('/searchVideo', validarUser, homeController.searchAll);
router.get('/search', validarUser, homeController.searchAllDirect);
router.get('/generos/:genero', validarUser, homeController.findByGenre);
router.get('/generos/:genero/:type', validarUser, homeController.findTypeGenre)
router.get('/getFindGenre/:page', homeController.getFindGenre);
router.get('/getFindGenreType/:page/:type', homeController.getFindGenreType);
router.get('/year/:year', validarUser, homeController.findByYear);
router.get('/getFindYear/:page', homeController.getFindYear);
router.get('/getFindYearType/:page/:type', homeController.getFindYearType);
router.get('/year/:year/:type', validarUser, homeController.findTypeYear);
router.get('/getTrailer/:search', trailerController.index);
router.get('/success', successController.index);
router.get('/error', successController.error);
router.get('/successRedirect', successController.successRedirect);
router.get('/errorRedirect', successController.errorRedirect);
router.post('/saveUser', loginController.register);
router.get('/getComments/:id', commentController.index);
router.get('/likeComment/:id', commentController.like);
router.get('/dislikeComment/:id', commentController.dislike);
router.get('/likeSubComment/:id', commentController.sublike);
router.get('/dislikeSubComment/:id', commentController.subdislike);
router.post('/saveWatchList/', watchlistController.save);
router.get('/my-list/', validarUserRedirect, watchlistController.index);
router.get('/my-list/:page', validarUserRedirect, watchlistController.index);
router.get('/findMyList/:page', watchlistController.findMyList);
router.get('/likeVideo/:id', reactionController.like);
router.get('/dislikeVideo/:id', reactionController.dislike);
router.get('/getLikesVideo/:id', reactionController.index);
router.post('/deleteWatchList/', watchlistController.delete);
router.get('/logout', loginController.logout);

router.get('/watch/:id', videoExtendController.index);
router.get('/videoExtend/:id', videoExtendController.getUrl);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/errorRedirect" }),
  function (req, res) {
    res.redirect("/successRedirect");
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/successRedirect",
    failureRedirect: "/errorRedirect",
  })
);

router.get('/outlook',
  passport.authenticate('windowslive', {
    scope: [
      'openid',
      'profile',
      'offline_access',
      'https://outlook.office.com/Mail.Read',
    ]
  })
);

router.get('/outlook/callback', 
  passport.authenticate('windowslive', { failureRedirect: '/errorRedirect' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


// router.get('/:page', homeController.index);

module.exports = { router };
