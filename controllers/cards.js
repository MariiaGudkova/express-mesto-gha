const mongoose = require('mongoose');
const Card = require('../models/card');
const BadRequestError = require('../errors/bad_request_err');
const ForbiddenError = require('../errors/forbidden_err');
const NotFoundError = require('../errors/notfound_err');

const getCards = (req, res, next) => {
  console.log(req);
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((e) => next(e));
};

const createCard = (req, res, next) => {
  const { user } = req;
  const { name, link } = req.body;
  Card.create({ name, link, owner: user._id })
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Переданы некорректные данные при создании карточки');
      }
      res.send({ data: card });
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(e);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).orFail()
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        card.remove();
        res.send({ data: card });
      } else {
        throw new ForbiddenError('Недостаточно прав для удаления карточки');
      }
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Передан некорректный _id карточки'));
        return;
      }
      if (e instanceof ForbiddenError) {
        next(e);
        return;
      }
      if (e instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
        return;
      }
      next(e);
    });
};

const likeCard = (req, res, next) => {
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
        next(new BadRequestError('Передан некорректный _id карточки'));
        return;
      }
      if (e instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
        return;
      }
      next(e);
    });
};

const dislikeCard = (req, res, next) => {
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
        next(new BadRequestError('Передан некорректный _id карточки'));
        return;
      }
      if (e instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
        return;
      }
      next(e);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
