const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const BadRequestError = require('../errors/bad_request_err');
const NotFoundError = require('../errors/notfound_err');
const ConflictError = require('../errors/conflict_err');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((e) => next(e));
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId).orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Передан некорректный _id пользователя'));
        return;
      }
      if (e instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
        return;
      }
      next(e);
    });
};

const getUserInfo = (req, res) => {
  const userId = req.user._id;
  req.params.userId = userId;
  getUserById(req, res);
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  })).then((user) => {
    const { password: p, ...data } = JSON.parse(JSON.stringify(user));
    res.send({ data });
  })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
        return;
      }
      if (e.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
        return;
      }
      next(e);
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  }).orFail()
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError || e instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
        return;
      }
      if (e instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
        return;
      }
      next(e);
    });
};

const updateUserProfileAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  }).orFail()
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError || e instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
        return;
      }
      if (e instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
        return;
      }
      next(e);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((e) => {
      next(e);
    });
};

module.exports = {
  getUsers,
  getUserById,
  getUserInfo,
  createUser,
  updateUserProfile,
  updateUserProfileAvatar,
  login,
};
