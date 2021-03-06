const ctrl = {};
const Serie = require('../models/Serie.model');
const WatchList = require('../models/WatchList.model');
const Movie = require('../models/Movie.model');

ctrl.index = (req, res) => {
  let user = req.user;
  let perPage = 24;
  let page = req.params.page || 1;
  Movie
    .find({type: 'Serie'})
    .sort({type: 1, _id: -1})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, series) => {
      Movie.countDocuments({type: 'Serie'}, (err, count) => {
        if(err) return next(err);
        res.render('index', {
          title: 'CotiPelisTV',
          peliculas: series,
          currentPage: page,
          pages: Math.ceil(count / perPage),
          section: 'Series',
          pagesInactive: false,
          videoStream: false,
          genreIndicate: false,
          user
        });
      })
    });
}

ctrl.find = async (req, res) => {
  let perPage = 24;
  let page = req.params.page || 1;
  let title = req.query.title;
  if(title) {
    let dataVideos = await Movie.find({title: {$regex: title}}).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
    // let series = await Serie.find({title: {$regex: title}}).sort({type: 1, _id: -1});
    // let dataPrevideos = peliculas.concat(series);
    // let dataVideos = paginate(dataPrevideos, 24, 1);
    res.json(dataVideos);
    return;
  }

  Movie
    .find({ type: 'Serie' })
    .sort({type: 1, _id: -1})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, series) => {
      Movie.countDocuments({type: 'Serie'}, (err, count) => {
        if(err) return next(err);
        res.send(series);
      })
    });
}

ctrl.streamVideo = async (req, res) => {
  let user = req.user;
  if(!req.user) {
    let id = req.params.id;
    let video = await Movie.findOne({_id: id, type: 'Serie'}).catch((err) => {
      res.render('404', {
        title: 'CotiPelisTV'
      });
    });
    let extraTitles = await Movie.find({type: 'Serie', genres: video.genres}, {title: 1}).sort({type: 1, _id: -1}).limit(6);
    // let videoWatch = await WatchList.findOne({ video_id: id });
    let savedVideo = false;
    // if(videoWatch) {
      // savedVideo = true;
    // }
    res.render('index', {
      title: 'CotiPelisTV',
      video,
      videoStream: true,
      section: 'Series',
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
  let video = await Movie.findOne({_id: id, type: 'Serie'}).catch((err) => {
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
  let extraTitles = await Movie.find({type: 'Serie', genres: video.genres}, {title: 1}).sort({type: 1, _id: -1}).limit(6);
  let videoWatch = await WatchList.findOne({ video_id: id, user_id: user.id });
  let savedVideo = false;
  if(videoWatch) {
    savedVideo = true;
  }
  res.render('index', {
    title: 'CotiPelisTV',
    video,
    videoStream: true,
    section: 'Series',
    pagesInactive: true,
    genreIndicate: false,
    extraTitles,
    validateUser: true,
    user,
    savedVideo
  });
}

ctrl.episodeStream = async (req, res) => {
  let user = req.user;
  if(!req.user) {
    let id = req.params.id;
    let temporada = req.params.temporada;
    let capitulo = req.params.capitulo;
    let video = await Movie.findOne({_id: id, type: 'Serie'});
    let extraTitles = await Movie.find({type: 'Serie', genres: video.genres}, {title: 1}).sort({type: 1, _id: -1}).limit(6);
    // let videoWatch = await WatchList.findOne({ video_id: id });
    let savedVideo = false;
    // if(videoWatch) {
      // // savedVideo = true;
    // }
    let result = video.seasons.find((v) => v.season == temporada && v.episode == capitulo);
    res.render('stream_episode',{
      title: 'CotiPelisTV',
      titleVideo: video.title,
      image: video.image,
      description: video.description,
      titleOriginal: video.titleOriginal,
      genres: video.genres,
      country: video.country,
      release: video.release,
      imageExtra: video.imageExtra,
      year: video.year,
      score: video.score,
      episode: result,
      pagesInactive: true,
      genreIndicate: false,
      extraTitles,
      _id: video._id,
      seasons: video.seasons,
      validateUser: false,
      user,
      savedVideo,
      typeName: video.type
    });
    return;
  }
  
  let id = req.params.id;
  let temporada = req.params.temporada;
  let capitulo = req.params.capitulo;
  let video = await Movie.findOne({_id: id, type: 'Serie'});
  let extraTitles = await Movie.find({type: 'Serie', genres: video.genres}, {title: 1}).sort({type: 1, _id: -1}).limit(6);
  let videoWatch = await WatchList.findOne({ video_id: id, user_id: user.id });
  let savedVideo = false;
  if(videoWatch) {
    savedVideo = true;
  }
  let result = video.seasons.find((v) => v.season == temporada && v.episode == capitulo);
  res.render('stream_episode',{
    title: 'CotiPelisTV',
    titleVideo: video.title,
    image: video.image,
    description: video.description,
    titleOriginal: video.titleOriginal,
    genres: video.genres,
    country: video.country,
    release: video.release,
    imageExtra: video.imageExtra,
    year: video.year,
    score: video.score,
    episode: result,
    pagesInactive: true,
    genreIndicate: false,
    extraTitles,
    _id: video._id,
    seasons: video.seasons,
    validateUser: true,
    user,
    savedVideo,
    typeName: video.type
  });
}

module.exports = ctrl;