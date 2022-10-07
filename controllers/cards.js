const Card = require('../models/card');

const NotFoundError = require('../errors/not_found_err');
const InputError = require('../errors/input_err');
const ForbiddenError = require('../errors/forbidden_err');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InputError('Переданы некорректные данные при создании карточки'));
      } else next(err);
    });
};

const deleteCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      const owner = card.owner._id.toString();

      if (owner !== userId) {
        throw new ForbiddenError('Нельзя удалять чужую карточку');
      }
      Card.findByIdAndDelete(cardId)
        .then((cardSelected) => res.send({ data: cardSelected }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InputError('Переданы некорректные данные для постановки/снятии лайка'));
      } else next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InputError('Переданы некорректные данные для постановки/снятии лайка'));
      } else next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InputError('Переданы некорректные данные для постановки/снятии лайка'));
      } else next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
