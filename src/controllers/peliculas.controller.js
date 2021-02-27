const ctrl = {};
const Pelicula = require('../models/Pelicula.model');
const WatchList = require('../models/WatchList.model');
const Movie = require('../models/Movie.model');

ctrl.index = (req, res) => {
  let user = req.user;
  let perPage = 24;
  let page = req.params.page || 1;
  Movie
    .find({type: 'Pelicula'})
    .sort({type: 1, _id: -1})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, pelis) => {
      Movie.countDocuments({type: 'Pelicula'}, (err, count) => {
        if(err) return next(err);
        res.render('index', {
          title: 'CotiPelisTV',
          peliculas: pelis,
          currentPage: page,
          pages: Math.ceil(count / perPage),
          section: 'Peliculas',
          pagesInactive: false,
          videoStream: false,
          genreIndicate: false,
          user
        });
      })
    });
}

ctrl.find = async (req, res) => {
  let title = req.query.title;
  let page = req.params.page || 1;
  let perPage = 24;
  if(title) {
    let dataVideos = await Movie.find({title: {$regex: title}}).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
    // let series = await Serie.find({title: {$regex: title}}).sort({type: 1, _id: -1});
    // let dataPrevideos = peliculas.concat(series);
    // let dataVideos = paginate(dataPrevideos, 24, 1);
    res.json(dataVideos);
    return;
  }
  Movie
    .find({type: 'Pelicula'})
    .sort({type: 1, _id: -1})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, pelis) => {
      Movie.countDocuments({type: 'Pelicula'}, (err, count) => {
        if(err) return next(err);
        res.send(pelis);
      })
    });
}

ctrl.streamVideo = async (req, res) => {
  let user = req.user;
  if(!req.user) {
    let id = req.params.id;
    let video = await Movie.findOne({_id: id, type: 'Pelicula'}).catch((err) => {
      res.render('404', {
        title: 'CotiPelisTV'
      });
    });
    if(video == null) {
      res.render('404', {
        title: 'CotiPelisTV'
      });
      return;
    }
    let extraTitles = await Movie.find({type: 'Pelicula', genres: video.genres}, {title: 1}).sort({type: 1, _id: -1}).limit(6);
    // let videoWatch = await WatchList.findOne({ video_id: id });
    let savedVideo = false;
    // if(videoWatch) {
      // savedVideo = true;
    // }
    res.render('index', {
      title: 'CotiPelisTV',
      video,
      videoStream: true,
      section: 'Peliculas',
      pagesInactive: true,
      genreIndicate: false,
      extraTitles,
      validateUser: false,
      user, 
      savedVideo
    });
    return;
  }
  
  let id = req.params.id;
  let video = await Movie.findOne({_id: id, type: 'Pelicula'}).catch((err) => {
    res.render('404', {
      title: 'CotiPelisTV'
    });
  });
  if(video == null) {
    res.render('404', {
      title: 'CotiPelisTV'
    });
    return;
  }
  let extraTitles = await Movie.find({type: 'Pelicula', genres: video.genres}, {title: 1}).sort({type: 1, _id: -1}).limit(6);
  let videoWatch = await WatchList.findOne({ video_id: id, user_id: user.id });
  let savedVideo = false;
  if(videoWatch) {
    savedVideo = true;
  }
  res.render('index', {
    title: 'CotiPelisTV',
    video,
    videoStream: true,
    section: 'Peliculas',
    pagesInactive: true,
    genreIndicate: false,
    extraTitles,
    validateUser: true,
    user,
    savedVideo
  });
}

module.exports = ctrl;