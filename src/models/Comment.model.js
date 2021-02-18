const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const CommentSchema = new Schema({
  video_id: { type: String, required: true },
  name: { type: String, required: true },
  comment: { type: String, required: true },
  foto: { type: String, required: true },
  likes: { type: [], required: false, default: [] },
  dislikes: { type: [], required: false, default: [] },
  subcomments: { type: [], required: false, default: [] },
  timestamp: { type: Date, default: Date.now }
});

// CommentSchema.virtual('image')
//   .set(function(image) {
//     this._image = image;
//   })
//   .get(function () {
//     return this._image;
//   });

module.exports = mongoose.model('Comment', CommentSchema);