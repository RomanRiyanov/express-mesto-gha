const Card = require('../models/card');

const { INPUT_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INPUT_ERROR).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new Error('Карточка с указанным _id не найдена');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(INPUT_ERROR).send({ message: 'Переданы некорректный _id карточки' });
      } else res.status(NOT_FOUND_ERROR).send({ message: err.message });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('Передан несуществующий _id карточки');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(INPUT_ERROR).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('Передан несуществующий _id карточки');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(INPUT_ERROR).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
