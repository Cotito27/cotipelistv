const mongoose = require('mongoose');
const { Schema } = mongoose;

const SerieSchema = new Schema({
  image: String,
  title: String,
  score: String,
  year: String,
  titleDownload: String,
  titleOriginal: String,
  description: String,
  genres: Object,
  country: String,
  release: String,
  imageExtra: String,
  seasons: [Object]
});

module.exports = mongoose.model('Serie', SerieSchema);