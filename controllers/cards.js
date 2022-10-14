const mongoose = require('mongoose');
const Card = require('../models/card');

const VALIDATION_ERROR_CODE = 400;
const NOTFOUND_ERROR_CODE = 404;
const SERVER_ERROR_CODE = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((e) => res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', error: e }));
};

const createCard = (req, res) => {
  const { user } = req;
  const { name, link } = req.body;
  Card.create({ name, link, owner: user._id })
    .then((card) => res.send({ data: card }))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки', error: e });
        return;
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', error: e });
    });
};

const deleteCard = (req, res) => {
  const { _id } = req.body;
  Card.findByIdAndRemove(req.user._id, { _id })
    .then((card) => res.send({ data: card }))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена', error: e });
        return;
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', error: e });
    });
};

const likeCard = (req, res) => {
  const { _id } = req.body;
  Card.findByIdAndUpdate(
    _id,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => res.send({ data: card }))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка', error: e });
        return;
      }
      if (e instanceof mongoose.Error.CastError) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки', error: e });
        return;
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', error: e });
    });
};

const dislikeCard = (req, res) => {
  const { _id } = req.body;
  Card.findByIdAndUpdate(
    _id,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => res.send({ data: card }))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка', error: e });
        return;
      }
      if (e instanceof mongoose.Error.CastError) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки', error: e });
        return;
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', error: e });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};