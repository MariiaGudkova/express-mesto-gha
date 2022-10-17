const mongoose = require('mongoose');
const Card = require('../models/card');
const { VALIDATION_ERROR_CODE, NOTFOUND_ERROR_CODE, SERVER_ERROR_CODE } = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' }));
};

const createCard = (req, res) => {
  const { user } = req;
  const { name, link } = req.body;
  Card.create({ name, link, owner: user._id })
    .then((card) => res.send({ data: card }))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).orFail()
    .then((card) => res.send({ data: card }))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Передан некорректный _id карточки' });
        return;
      }
      if (e instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  ).orFail()
    .then((card) => res.send({ data: card }))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Передан некорректный _id карточки' });
        return;
      }
      if (e instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  ).orFail()
    .then((card) => res.send({ data: card }))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Передан некорректный _id карточки' });
        return;
      }
      if (e instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
