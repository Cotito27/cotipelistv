const ctrl = {};

const Pelicula = require('../models/Pelicula.model');
const Serie = require('../models/Serie.model');
const Movie = require('../models/Movie.model');

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
     .replace(/u/g, '[u,ü,ú,ù]')
     ;
}

ctrl.index = async (req, res) => {
  let user = req.user;
  let titleSearch = req.query.title;
  let page = req.query.page || 1;
  let perPage = 24;
  if(titleSearch) {
  let dataVideos = await Movie.find({title: {$regex: titleSearch, type: 'Pelicula'}}).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
  // let series = await Serie.find({title: {$regex: titleSearch}}).sort({type: 1, _id: -1});
  // let dataPrevideos = peliculas.concat(series);
  // let dataVideos = paginate(dataPrevideos, 24, 1);
    res.render('index', {
      title: 'CotiPelisTV',
      dataVideos,
      section: 'Peliculas, Series y Animes',
      pagesInactive: false,
      videoStream: false,
      user
    })
    return;
  }
  let peliculas = await Movie.find({ type: 'Pelicula' }).sort({type: 1, _id: -1}).limit(24);
  let popularVideos = await Movie.find({ type: 'Pelicula' }).sort({'score':-1}).limit(10);
  // console.log(peliculas[0].title);
  // let popularVideos = peliculas.sort(function (a, b) { return parseFloat(b.score.split('/')[0]) - parseFloat(a.score.split('/')[0]); }).slice(0, 10);
  res.render('index', {
    title: 'CotiPelisTV',
    peliculas,
    section: 'Peliculas',
    pagesInactive: true,
    popularVideos,
    videoStream: false,
    genreIndicate: false,
    user
  })
}

ctrl.getSerie = async (req, res) => {
  let series = await Movie.find({type: 'Serie'}).sort({type: 1, _id: -1}).limit(24);
  res.json(series);
}

ctrl.getAnime = async (req, res) => {
  let animes = await Movie.find({type: 'Anime'}).sort({type: 1, _id: -1}).limit(24);
  res.json(animes);
}

ctrl.search = async (req, res) => {
  let title = req.params.title;
  let page = req.query.page || 1;
  // title = quitarAcentos(title);
  // console.log(title);
  let perPage = 24;
  // console.log(diacriticSensitiveRegex(title));
  let dataQuery = {$or: [{title :{'$regex' : `.*${diacriticSensitiveRegex(title)}.*`, '$options' : 'i'}}, {titleOriginal :{'$regex' : `.*${diacriticSensitiveRegex(title)}.*`, '$options' : 'i'}}, {title :{'$regex' : `.*${diacriticSensitiveRegex(title).replace(/[ ]/g, '-')}.*`, '$options' : 'i'}}, {titleOriginal :{'$regex' : `.*${diacriticSensitiveRegex(title).replace(/[ ]/g, '-')}.*`, '$options' : 'i'}}]};
  let dataVideos = await Movie.find(dataQuery).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
  let pages = await Movie.countDocuments(dataQuery);
  pages = Math.ceil(pages / perPage);
  // let series = await Serie.find({$or: [{title :{'$regex' : `.*${diacriticSensitiveRegex(title)}.*`, '$options' : 'i'}}, {titleOriginal :{'$regex' : `.*${diacriticSensitiveRegex(title)}.*`, '$options' : 'i'}}, {title :{'$regex' : `.*${diacriticSensitiveRegex(title).replace(' ', '-')}.*`, '$options' : 'i'}}, {titleOriginal :{'$regex' : `.*${diacriticSensitiveRegex(title).replace(' ', '-')}.*`, '$options' : 'i'}}]}).sort({type: 1, _id: -1});
  // let dataPrevideos = peliculas.concat(series);
  // let dataVideos = paginate(dataPrevideos, 24, page);
  // let pages = Math.ceil(dataPrevideos.length / 24);
  res.json({
    movies: dataVideos,
    pages,
    page
  });
}

ctrl.searchDirect = async (req, res) => {
  let user = req.user;
  let title = req.params.title;
  let page = req.query.page || 1;
  // title = quitarAcentos(title);
  // console.log(title);
  let perPage = 24;
  let dataQuery = {$or: [{title :{'$regex' : `.*${diacriticSensitiveRegex(title)}.*`, '$options' : 'i'}}, {titleOriginal :{'$regex' : `.*${diacriticSensitiveRegex(title)}.*`, '$options' : 'i'}}, {title :{'$regex' : `.*${diacriticSensitiveRegex(title).replace(/[ ]/g, '-')}.*`, '$options' : 'i'}}, {titleOriginal :{'$regex' : `.*${diacriticSensitiveRegex(title).replace(/[ ]/g, '-')}.*`, '$options' : 'i'}}]};
  let dataVideos = await Movie.find(dataQuery).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
  let pages = await Movie.countDocuments(dataQuery);
  pages = Math.ceil(pages / perPage);
  // let series = await Serie.find({$or: [{title :{'$regex' : `.*${diacriticSensitiveRegex(title)}.*`, '$options' : 'i'}}, {titleOriginal :{'$regex' : `.*${diacriticSensitiveRegex(title)}.*`, '$options' : 'i'}}, {title :{'$regex' : `.*${diacriticSensitiveRegex(title).replace(' ', '-')}.*`, '$options' : 'i'}}, {titleOriginal :{'$regex' : `.*${diacriticSensitiveRegex(title).replace(' ', '-')}.*`, '$options' : 'i'}}]}).sort({type: 1, _id: -1});
  // let dataPrevideos = peliculas.concat(series);
  // let dataVideos = paginate(dataPrevideos, 24, page);
  // let pages = Math.ceil(dataPrevideos.length / 24);
  res.render('index', {
    title: 'CotiPelisTV',
    movies:dataVideos,
    section: 'Peliculas, Series y Animes',
    currentPage: page,
    pagesInactive: false,
    videoStream: false,
    genreIndicate: true,
    pages,
    genero: false,
    titleSearch: title,
    yearActive: false,
    user
  });
}

ctrl.searchAll = async (req, res) => {
  let page = req.query.page || 1;
  let perPage = 24;
  let title = '';
  let dataVideos = await Movie.find({}).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
  // let series = await Serie.find({}).sort({type: 1, _id: -1});
  // let dataPrevideos = peliculas.concat(series);
  // let dataVideos = paginate(dataPrevideos, 24, page)
  // console.log(dataVideos);
  let pages = await Movie.countDocuments({});
  pages = Math.ceil(pages / perPage);
  res.json({
    movies: dataVideos,
    pages,
    page
  });
}

ctrl.searchAllDirect = async (req, res) => {
  let user = req.user;
  let page = req.query.page || 1;
  let title = '';
  let perPage = 24;
  let dataVideos = await Movie.find({}).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
  let pages = await Movie.countDocuments({});
  pages = Math.ceil(pages / perPage);
  // let series = await Movie.find({}).sort({type: 1, _id: -1});
  // let dataPrevideos = peliculas.concat(series);
  // let dataVideos = paginate(dataPrevideos, 24, page);
  // let pages = Math.ceil(dataPrevideos.length / 24);
  res.render('index', {
    title: 'CotiPelisTV',
    movies: dataVideos,
    section: 'Peliculas, Series y Animes',
    currentPage: page,
    pagesInactive: false,
    videoStream: false,
    genreIndicate: true,
    pages,
    genero: false,
    titleSearch: title,
    yearActive: false,
    user
  });
}

ctrl.findByGenre = async (req, res) => {
  let user = req.user;
  let page = req.query.page || 1;
  let genero = req.params.genero;
  let perPage = 24;
  let dataQuery = {genres: {$regex: genero}};
  let dataVideos = await Movie.find(dataQuery).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
  let pages = await Movie.countDocuments(dataQuery);
  pages = Math.ceil(pages / perPage);
  // let series = await Serie.find({genres: {$regex: genero}}).sort({type: 1, _id: -1});
  // let dataPrevideos = peliculas.concat(series);
  // let dataVideos = paginate(dataPrevideos, 24,page || 1);
  // let pages = Math.ceil(dataPrevideos.length / 24)
  res.render('index', {
    title: 'CotiPelisTV',
    movies: dataVideos,
    section: 'Peliculas, Series y Animes',
    currentPage: page,
    pages,
    pagesInactive: false,
    videoStream: false,
    genreIndicate: true,
    genero,
    yearActive: false,
    user
  });
}

ctrl.getFindGenre = async (req, res) => {
  let page = req.params.page;
  let genero = req.query.genero;
  let perPage = 24;
  let dataVideos = await Movie.find({genres: {$regex: genero}}).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
  // let series = await Serie.find({genres: {$regex: genero}}).sort({type: 1, _id: -1});
  // let dataPrevideos = peliculas.concat(series);
  // let dataVideos = paginate(dataPrevideos, 24,page || 1);
  res.json(dataVideos);
}

ctrl.getFindGenreType = async (req, res) => {
  let page = req.params.page;
  let genero = req.query.genero;
  let type = req.params.type;
  let perPage = 24;
  if(type == 'peliculas') {
    let dataVideos = await Movie.find({type:'Pelicula', genres: {$regex: genero}}).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
    // let dataPrevideos = peliculas;
    // let dataVideos = paginate(dataPrevideos, 24,page || 1);
    res.json(dataVideos);
  } else if(type == 'series') {
    let dataVideos = await Movie.find({type: 'Serie', genres: {$regex: genero}}).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
    // let dataPrevideos = series;
    // let dataVideos = paginate(dataPrevideos, 24,page || 1);
    res.json(dataVideos);
  } else if(type == 'animes') {
    let dataVideos = await Movie.find({type: 'Anime', genres: {$regex: genero}}).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
    // let dataPrevideos = series;
    // let dataVideos = paginate(dataPrevideos, 24,page || 1);
    res.json(dataVideos);
  }
  
}

ctrl.findTypeGenre = async (req, res) => {
  let user = req.user;
  let type = req.params.type;
  let page = req.query.page || 1;
  let genero = req.params.genero;
  let perPage = 24;
  if(type == 'peliculas') {
    let dataQuery = {type: 'Pelicula', genres: {$regex: genero}};
    let dataVideos = await Movie.find(dataQuery).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
    let pages = await Movie.countDocuments(dataQuery);
    pages = Math.ceil(pages / perPage);
    // let dataPrevideos = peliculas;
    // let dataVideos = paginate(dataPrevideos, 24,page || 1);
    // let pages = Math.ceil(dataPrevideos.length / 24)
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
      yearActive: false,
      user
    });
  } else if(type == 'series') {
    let dataQuery = {type: 'Serie', genres: {$regex: genero}};
    let dataVideos = await Movie.find(dataQuery).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
    let pages = await Movie.countDocuments(dataQuery);
    pages = Math.ceil(pages / perPage);
    // let dataPrevideos = series;
    // let dataVideos = paginate(dataPrevideos, 24,page || 1);
    // let pages = Math.ceil(dataPrevideos.length / 24)
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
      yearActive: false,
      user
    });
  } else if(type == 'animes') {
    let dataQuery = {type: 'Anime', genres: {$regex: genero}};
    let dataVideos = await Movie.find(dataQuery).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
    let pages = await Movie.countDocuments(dataQuery);
    pages = Math.ceil(pages / perPage);
    // let dataPrevideos = series;
    // let dataVideos = paginate(dataPrevideos, 24,page || 1);
    // let pages = Math.ceil(dataPrevideos.length / 24)
    res.render('index', {
      title: 'CotiPelisTV',
      movies: dataVideos,
      section: 'Animes',
      currentPage: page,
      pages,
      pagesInactive: false,
      videoStream: false,
      genreIndicate: true,
      genero,
      yearActive: false,
      user
    });
  }
  
}

ctrl.findByYear = async (req, res) => {
  let user = req.user;
  let page = req.query.page || 1;
  let year = req.params.year;
  let perPage = 24;
  let dataQuery = {year};
  let dataVideos = await Movie.find(dataQuery).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
  let pages = await Movie.countDocuments(dataQuery);
  pages = Math.ceil(pages / perPage);
  // let series = await Serie.find({year}).sort({type: 1, _id: -1});
  // let dataPrevideos = peliculas.concat(series);
  // let dataVideos = paginate(dataPrevideos, 24,page || 1);
  // let pages = Math.ceil(dataPrevideos.length / 24)
  res.render('index', {
    title: 'CotiPelisTV',
    movies: dataVideos,
    section: 'Peliculas, Series y Animes',
    currentPage: page,
    pages,
    page,
    pagesInactive: false,
    videoStream: false,
    genreIndicate: true,
    genero: false,
    yearActive: true,
    year,
    user
  });
}

ctrl.getFindYear = async (req, res) => {
  let page = req.params.page || 1;
  let year = req.query.year;
  let perPage = 24;
  let dataQuery = {year};
  let dataVideos = await Movie.find(dataQuery).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
  // let dataPrevideos = peliculas.concat(series);
  // let dataVideos = paginate(dataPrevideos, 24,page || 1);
  // let pages = Math.ceil(dataPrevideos.length / 24)
  res.json(dataVideos);
}

ctrl.getFindYearType = async (req, res) => {
  let page = req.params.page;
  let year = req.query.year;
  let type = req.params.type;
  let perPage = 24;
  if(type == 'peliculas') {
    let dataVideos = await Movie.find({type: 'Pelicula',year}).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
    // let dataPrevideos = peliculas;
    // let dataVideos = paginate(dataPrevideos, 24,page || 1);
    res.json(dataVideos);
  } else if(type == 'series') {
    let dataVideos = await Movie.find({ type: 'Serie', year}).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
    // let dataPrevideos = series;
    // let dataVideos = paginate(dataPrevideos, 24,page || 1);
    res.json(dataVideos);
  } else if(type == 'animes') {
    let dataVideos = await Movie.find({ type: 'Anime', year}).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
    // let dataPrevideos = series;
    // let dataVideos = paginate(dataPrevideos, 24,page || 1);
    res.json(dataVideos);
  }
}

ctrl.findTypeYear = async (req, res) => {
  let user = req.user;
  let type = req.params.type;
  let perPage = 24;
  let page = req.query.page || 1;
  let year = req.params.year;
  if(type == 'peliculas') {
    let dataQuery = { type: 'Pelicula', year};
    let dataVideos = await Movie.find(dataQuery).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
    let pages = await Movie.countDocuments(dataQuery);
    pages = Math.ceil(pages / perPage);
    // let dataPrevideos = peliculas;
    // let dataVideos = paginate(dataPrevideos, 24,page || 1);
    // let pages = Math.ceil(dataPrevideos.length / 24)
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
      year,
      user
    });
  } else if(type == 'series') {
    let dataQuery = { type: 'Serie', year};
    let dataVideos = await Movie.find(dataQuery).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
    let pages = await Movie.countDocuments(dataQuery);
    pages = Math.ceil(pages / perPage);
    // let dataPrevideos = series;
    // let dataVideos = paginate(dataPrevideos, 24,page || 1);
    // let pages = Math.ceil(dataPrevideos.length / 24);
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
      year,
      user
    });
  } else if(type == 'animes') {
    let dataQuery = { type: 'Anime', year};
    let dataVideos = await Movie.find(dataQuery).sort({type: 1, _id: -1}).skip((perPage * page) - perPage).limit(perPage);
    let pages = await Movie.countDocuments(dataQuery);
    pages = Math.ceil(pages / perPage);
    // let dataPrevideos = series;
    // let dataVideos = paginate(dataPrevideos, 24,page || 1);
    // let pages = Math.ceil(dataPrevideos.length / 24);
    res.render('index', {
      title: 'CotiPelisTV',
      movies: dataVideos,
      section: 'Animes',
      currentPage: page,
      pages,
      page,
      pagesInactive: false,
      videoStream: false,
      genreIndicate: true,
      genero: false,
      yearActive: true,
      year,
      user
    });
  }
}

module.exports = ctrl;