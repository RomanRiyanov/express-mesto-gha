const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => { isURL(v); },
      message: 'Неправльный формат ссылки',
    },
  },
  owner: {
    ref: 'user',
    type: mongoose.ObjectId,
    required: true,
  },
  likes: {
    ref: 'user',
    type: [mongoose.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
