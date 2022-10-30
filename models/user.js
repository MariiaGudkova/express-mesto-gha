const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/unauthorized_err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: (value) => {
      if (validator.isURL(value)) {
        return true;
      }
      return false;
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => {
      if (validator.isEmail(value)) {
        return true;
      }
      return false;
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  versionKey: false,
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password').orFail(() => new UnauthorizedError('Неправильные почта или пароль'))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
        }
        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);
