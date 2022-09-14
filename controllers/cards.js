const createError = require('http-errors');
const Card = require('../models/card');
const { errorHandler } = require('../utils/utils');

// const INPUT_ERROR = 400;
// const NOT_FOUND_ERROR = 404;
// const DEFAULT_ERROR = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      errorHandler(err, res);
      // res.status(DEFAULT_ERROR).send({ message: 'Карточка не найдена' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      errorHandler(err, res);
      // if (err.name === 'CastError') {
      //   res.status(INPUT_ERROR).send({ message: 'Неверно введены данные' });
      // } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw createError(404, 'Карточка с указанным _id не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      errorHandler(err, res);
      // if (err.name === 'NotFoundError') {
      //   res.status(NOT_FOUND_ERROR).send({ message: err.message });
      // } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw createError(404, 'Карточка с указанным _id не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      console.log(err.name);
      errorHandler(err, res);
    //   if (err.name === 'NotFoundError') {
    //     res.status(NOT_FOUND_ERROR).send({ message: err.message });
    //   } else if (err.name === 'ValidationError') {
    //     res.status(INPUT_ERROR)
    // .send({ message: 'Переданы некорректные данные при постановке/снятии лайка' });
    //   } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw createError(404, 'Карточка с указанным _id не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      errorHandler(err, res);
      // if (err.name === 'NotFoundError') {
      //   res.status(NOT_FOUND_ERROR).send({ message: err.message });
      // } else if (err.name === 'ValidationError') {
      //   res.status(INPUT_ERROR)
      // .send({ message: 'Переданы некорректные данные при постановке/снятии лайка' });
      // } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
