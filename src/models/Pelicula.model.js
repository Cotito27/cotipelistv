const mongoose = require('mongoose');
const { Schema } = mongoose;

const PeliculaSchema = new Schema({
  image: String,
  title: String,
  score: String,
  year: String,
  titleDownload: String,
  titleOriginal: String,
  description: String,
  genres: [],
  country: String,
  release: String,
  imageExtra: String,
  embedUrls: []
});

module.exports = mongoose.model('Pelicula', PeliculaSchema);