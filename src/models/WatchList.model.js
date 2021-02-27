const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const WatchListSchema = new Schema({
  video_id: { type: String, required: true },
  user_id: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  year: { type: String, required: false },
  score: { type: String },
  type: { type: String }
});

module.exports = mongoose.model('WatchList', WatchListSchema);