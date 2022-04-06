const { Schema, model } = require('mongoose');
const validator = require('validator');

const schema = new Schema({
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
      validator: (url) => validator.isURL(url),
      message: 'Введён некорректный URL',
    },
  },
  owner: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Card', schema);
