const mongoose = require('mongoose');
const { Schema } = mongoose;

const MovieSchema = new Schema({
  type: { type: String, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  score: { type: String, required: true },
  year: { type: String, required: false },
  titleDownload: { type: String, required: true },
  titleOriginal: { type: String, required: true },
  description: { type: String, required: true },
  genres: { type: [], required: true },
  country: { type: String, required: false },
  release: { type: String },
  imageExtra: { type: String, required: true },
  embedUrls: { type: [], required: false },
  seasons: { type: [Object], required: false }
});

module.exports = mongoose.model('Movie', MovieSchema);