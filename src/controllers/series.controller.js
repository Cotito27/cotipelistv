const ctrl = {};
const Serie = require('../models/Serie.model');

ctrl.index = (req, res) => {
  let perPage = 24;
  let page = req.params.page || 1;
  Serie
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, series) => {
      Serie.countDocuments((err, count) => {
        if(err) return next(err);
        res.render('index', {
          title: 'CotiPelisTV',
          peliculas: series,
          currentPage: page,
          pages: Math.ceil(count / perPage),
          section: 'Series',
          pagesInactive: false,
          videoStream: false,
          genreIndicate: false
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
  Serie
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, series) => {
      Serie.countDocuments((err, count) => {
        if(err) return next(err);
        res.send(series);
      })
    });
}

ctrl.streamVideo = async (req, res) => {
  let id = req.params.id;
  let video = await Serie.findOne({_id: id});
  let extraTitles = await Serie.find({genres: video.genres}, {title: 1}).limit(6);
  res.render('index', {
    title: 'CotiPelisTV',
    video,
    videoStream: true,
    section: 'Series',
    pagesInactive: true,
    genreIndicate: false,
    extraTitles
  });
}

ctrl.episodeStream = async (req, res) => {
  let id = req.params.id;
  let temporada = req.params.temporada;
  let capitulo = req.params.capitulo;
  let video = await Serie.findOne({_id: id});
  let extraTitles = await Serie.find({genres: video.genres}, {title: 1}).limit(6);
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
    extraTitles
  });
}

module.exports = ctrl;