const mongoose = require('mongoose');
const User = require('../models/user');

const VALIDATION_ERROR_CODE = 400;
const NOTFOUND_ERROR_CODE = 404;
const SERVER_ERROR_CODE = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((e) => res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', error: e }));
};

const getUserById = (req, res) => {
  const { _id } = req.body;
  User.findById(_id).orFail(new Error('NotFoud'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Передан некорректный _id пользователя', error: e });
        return;
      }
      if (e.message === 'NotFound') {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден', error: e });
        return;
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', error: e });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя', error: e });
        return;
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', error: e });
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля', error: e });
        return;
      }
      if (e instanceof mongoose.Error.CastError) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', error: e });
    });
};

const updateUserProfileAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара', error: e });
        return;
      }
      if (e instanceof mongoose.Error.CastError) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', error: e });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserProfileAvatar,
};
