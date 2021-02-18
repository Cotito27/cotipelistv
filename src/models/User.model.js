const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  foto: {
    type: String,
    required: false,
    default: '/img/user_change.PNG'
  },
  public_id: {
    type: String,
    required: false
  }
});

UserSchema.pre('save', function(next) {
  bcrypt.genSalt(10).then(salts => {
    bcrypt.hash(this.password, salts).then(hash => {
      this.password = hash;
      next();
    })
  }).catch(error => next(error))
});

module.exports = mongoose.model('User', UserSchema);