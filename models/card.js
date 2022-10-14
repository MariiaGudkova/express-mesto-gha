const mongoose = require('mongoose');
const validator = require('validator');

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
    validate: (value) => {
      if (validator.isURL(value)) {
        return true;
      }
      return false;
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    validate: (value) => {
      if (validator.isMongoId(value.toString())) {
        return true;
      }
      return false;
    },
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    validate: (value) => {
      if (!Array.isArray(value)) {
        return false;
      }
      return value.every((val) => validator.isMongoId(val.toString()));
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    validate: (value) => {
      if (validator.isDate(value)) {
        return true;
      }
      return false;
    },
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model('card', cardSchema);
