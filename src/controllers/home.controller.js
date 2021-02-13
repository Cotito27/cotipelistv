const ctrl = {};

const Pelicula = require('../models/Pelicula.model');
const Serie = require('../models/Serie.model');

function paginate(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

function quitarAcentos(cadena){
	const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
	return cadena.split('').map( letra => acentos[letra] || letra).join('').toString();	
}

function diacriticSensitiveRegex(string = '') {
  return string.replace(/a/g, '[a,á,à,ä]')
     .replace(/e/g, '[e,é,ë]')
     .replace(/i/g, '[i,í,ï]')
     .replace(/o/g, '[o,ó,ö,ò]')
     .replace(/u/g, '[u,ü,ú,ù]');
}

ctrl.index = async (req, res) => {
  let titleSearch = req.query.title;
  if(titleSearch) {
  let peliculas = await Pelicula.find({title: {$regex: titleSearch}});
  let series = await Serie.find({title: {$regex: titleSearch}});
  let dataPrevideos = peliculas.concat(series);
  let dataVideos = paginate(dataPrevideos, 24, 1);
    res.render('index', {
      title: 'CotiPelisTV',
      dataVideos,
      section: 'Peliculas y Series',
      pagesInactive: false,
      videoStream: false
    })
    return;
  }
  let peliculas = await Pelicula.find({}).limit(24);
  let popularVideos = await Pelicula.find({}).sort({'score':-1}).limit(10);
  // let popularVideos = peliculas.sort(function (a, b) { return parseFloat(b.score.split('/')[0]) - parseFloat(a.score.split('/')[0]); }).slice(0, 10);
  res.render('index', {
    title: 'CotiPelisTV',
    peliculas,
    section: 'Peliculas',
    pagesInactive: true,
    popularVideos,
    videoStream: false,
    genreIndicate: false
  })
}

ctrl.getSerie = async (req, res) => {
  let series = await Serie.find({}).limit(24);
  res.json(series);
}

ctrl.search = async (req, res) => {
  let title = req.params.title;
  let page = req.query.page || 1;
  // title = quitarAcentos(title);
  // console.log(title);
  let peliculas = await Pelicula.find({title :{'$regex' : `^${diacriticSensitiveRegex(title)}.*`, '$options' : 'i'}});
  let series = await Serie.find({title :{'$regex' : `^${diacriticSensitiveRegex(title)}.*`, '$options' : 'i'}});
  let dataPrevideos = peliculas.concat(series);
  let dataVideos = paginate(dataPrevideos, 24, page);
  let pages = Math.ceil(dataPrevideos.length / 24);
  res.json({
    movies: dataVideos,
    pages,
    page
  });
}

ctrl.searchDirect = async (req, res) => {
  let title = req.params.title;
  let page = req.query.page || 1;
  // title = quitarAcentos(title);
  // console.log(title);
  let peliculas = await Pelicula.find({title :{'$regex' : `^${diacriticSensitiveRegex(title)}.*`, '$options' : 'i'}});
  let series = await Serie.find({title :{'$regex' : `^${diacriticSensitiveRegex(title)}.*`, '$options' : 'i'}});
  let dataPrevideos = peliculas.concat(series);
  let dataVideos = paginate(dataPrevideos, 24, page);
  let pages = Math.ceil(dataPrevideos.length / 24);
  res.render('index', {
    title: 'CotiPelisTV',
    movies:dataVideos,
    section: 'Peliculas y Series',
    currentPage: page,
    pagesInactive: false,
    videoStream: false,
    genreIndicate: true,
    pages,
    genero: false,
    titleSearch: title,
    yearActive: false
  });
}

ctrl.findByGenre = async (req, res) => {
  let page = req.query.page || 1;
  let genero = req.params.genero;
  let peliculas = await Pelicula.find({genres: {$regex: genero}});
  let series = await Serie.find({genres: {$regex: genero}});
  let dataPrevideos = peliculas.concat(series);
  let dataVideos = paginate(dataPrevideos, 24,page || 1);
  let pages = Math.ceil(dataPrevideos.length / 24)
  res.render('index', {
    title: 'CotiPelisTV',
    movies: dataVideos,
    section: 'Peliculas y Series',
    currentPage: page,
    pages,
    pagesInactive: false,
    videoStream: false,
    genreIndicate: true,
    genero,
    yearActive: false
  });
}

ctrl.getFindGenre = async (req, res) => {
  let page = req.params.page;
  let genero = req.query.genero;
  let peliculas = await Pelicula.find({genres: {$regex: genero}});
  let series = await Serie.find({genres: {$regex: genero}});
  let dataPrevideos = peliculas.concat(series);
  let dataVideos = paginate(dataPrevideos, 24,page || 1);
  res.json(dataVideos);
}

ctrl.getFindGenreType = async (req, res) => {
  let page = req.params.page;
  let genero = req.query.genero;
  let type = req.params.type;
  if(type == 'peliculas') {
    let peliculas = await Pelicula.find({genres: {$regex: genero}});
    let dataPrevideos = peliculas;
    let dataVideos = paginate(dataPrevideos, 24,page || 1);
    res.json(dataVideos);
  } else if(type == 'series') {
    let series = await Serie.find({genres: {$regex: genero}});
    let dataPrevideos = series;
    let dataVideos = paginate(dataPrevideos, 24,page || 1);
    res.json(dataVideos);
  }
  
}

ctrl.findTypeGenre = async (req, res) => {
  let type = req.params.type;
  if(type == 'peliculas') {
    let page = req.query.page || 1;
    let genero = req.params.genero;
    let peliculas = await Pelicula.find({genres: {$regex: genero}});
    let dataPrevideos = peliculas;
    let dataVideos = paginate(dataPrevideos, 24,page || 1);
    let pages = Math.ceil(dataPrevideos.length / 24)
    res.render('index', {
      title: 'CotiPelisTV',
      movies: dataVideos,
      section: 'Peliculas',
      currentPage: page,
      pages,
      pagesInactive: false,
      videoStream: false,
      genreIndicate: true,
      genero,
      yearActive: false
    });
  } else if(type == 'series') {
    let page = req.query.page || 1;
    let genero = req.params.genero;
    let series = await Serie.find({genres: {$regex: genero}});
    let dataPrevideos = series;
    let dataVideos = paginate(dataPrevideos, 24,page || 1);
    let pages = Math.ceil(dataPrevideos.length / 24)
    res.render('index', {
      title: 'CotiPelisTV',
      movies: dataVideos,
      section: 'Series',
      currentPage: page,
      pages,
      pagesInactive: false,
      videoStream: false,
      genreIndicate: true,
      genero,
      yearActive: false
    });
  }
  
}

ctrl.findByYear = async (req, res) => {
  let page = req.query.page || 1;
  let year = req.params.year;
  let peliculas = await Pelicula.find({year});
  let series = await Serie.find({year});
  let dataPrevideos = peliculas.concat(series);
  let dataVideos = paginate(dataPrevideos, 24,page || 1);
  let pages = Math.ceil(dataPrevideos.length / 24)
  res.render('index', {
    title: 'CotiPelisTV',
    movies: dataVideos,
    section: 'Peliculas y Series',
    currentPage: page,
    pages,
    page,
    pagesInactive: false,
    videoStream: false,
    genreIndicate: true,
    genero: false,
    yearActive: true,
    year
  });
}

ctrl.getFindYear = async (req, res) => {
  let page = req.params.page || 1;
  let year = req.query.year;
  let peliculas = await Pelicula.find({year});
  let series = await Serie.find({year});
  let dataPrevideos = peliculas.concat(series);
  let dataVideos = paginate(dataPrevideos, 24,page || 1);
  let pages = Math.ceil(dataPrevideos.length / 24)
  res.json(dataVideos);
}

ctrl.getFindYearType = async (req, res) => {
  let page = req.params.page;
  let year = req.query.year;
  let type = req.params.type;
  if(type == 'peliculas') {
    let peliculas = await Pelicula.find({year});
    let dataPrevideos = peliculas;
    let dataVideos = paginate(dataPrevideos, 24,page || 1);
    res.json(dataVideos);
  } else if(type == 'series') {
    let series = await Serie.find({year});
    let dataPrevideos = series;
    let dataVideos = paginate(dataPrevideos, 24,page || 1);
    res.json(dataVideos);
  }
}

ctrl.findTypeYear = async (req, res) => {
  let type = req.params.type;
  if(type == 'peliculas') {
    let page = req.query.page || 1;
    let year = req.params.year;
    let peliculas = await Pelicula.find({year});
    let dataPrevideos = peliculas;
    let dataVideos = paginate(dataPrevideos, 24,page || 1);
    let pages = Math.ceil(dataPrevideos.length / 24)
    res.render('index', {
      title: 'CotiPelisTV',
      movies: dataVideos,
      section: 'Peliculas',
      currentPage: page,
      pages,
      page,
      pagesInactive: false,
      videoStream: false,
      genreIndicate: true,
      genero: false,
      yearActive: true,
      year
    });
  } else if(type == 'series') {
    let page = req.query.page || 1;
    let year = req.params.year;
    let series = await Serie.find({year});
    let dataPrevideos = series;
    let dataVideos = paginate(dataPrevideos, 24,page || 1);
    let pages = Math.ceil(dataPrevideos.length / 24)
    res.render('index', {
      title: 'CotiPelisTV',
      movies: dataVideos,
      section: 'Series',
      currentPage: page,
      pages,
      page,
      pagesInactive: false,
      videoStream: false,
      genreIndicate: true,
      genero: false,
      yearActive: true,
      year
    });
  }
}

module.exports = ctrl;