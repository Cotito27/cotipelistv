const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const ReactionSchema = new Schema({
  video_id: { type: String, required: true },
  user_id: { type: String, required: true },
  likes: { type: [] },
  dislikes: { type: [] }
});

module.exports = mongoose.model('Reaction', ReactionSchema);