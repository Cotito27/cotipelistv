const ctrl = {};
const Pelicula = require('../models/Pelicula.model');

ctrl.index = (req, res) => {
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
  let id = req.params.id;
  let video = await Pelicula.findOne({_id: id});
  res.render('index', {
    title: 'CotiPelisTV',
    video,
    videoStream: true,
    section: 'Peliculas',
    pagesInactive: true,
    genreIndicate: false
  });
}

module.exports = ctrl;