const ctrl = {};
const Pelicula = require('../models/Pelicula.model');
const WatchList = require('../models/WatchList.model');

ctrl.index = (req, res) => {
  let user = req.user;
  let perPage = 24;
  let page = req.params.page || 1;
  Pelicula
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, pelis) => {
      Pelicula.countDocuments((err, count) => {
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
  if(title) {
    let peliculas = await Pelicula.find({title: {$regex: title}});
    let series = await Serie.find({title: {$regex: title}});
    let dataPrevideos = peliculas.concat(series);
    let dataVideos = paginate(dataPrevideos, 24, 1);
    res.json(dataVideos);
    return;
  }
  let perPage = 24;
  let page = req.params.page || 1;
  Pelicula
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, pelis) => {
      Pelicula.countDocuments((err, count) => {
        if(err) return next(err);
        res.send(pelis);
      })
    });
}

ctrl.streamVideo = async (req, res) => {
  let user = req.user;
  if(!req.user) {
    let id = req.params.id;
    let video = await Pelicula.findOne({_id: id});
    let extraTitles = await Pelicula.find({genres: video.genres}, {title: 1}).limit(6);
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
  let video = await Pelicula.findOne({_id: id});
  let extraTitles = await Pelicula.find({genres: video.genres}, {title: 1}).limit(6);
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