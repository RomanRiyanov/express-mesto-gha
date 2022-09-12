const Card = require('../models/card');

const INPUT_ERROR = 400;
const NOT_FOUND_ERROR = 404;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((error) => res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена' }, error));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  if (name && link) {
    Card.create({ name, link, owner: req.user._id })
      .then((card) => res.send(card))
      .catch(() => res.status(INPUT_ERROR).send({ message: 'Неверно введены данные' }));
  } else res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена' });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      res.status(INPUT_ERROR).send({ message: 'id карточки введен неверно' });
    })
    .then((card) => res.send({ data: card }))
    .catch((error) => res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена' }, error));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена' });
    })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(INPUT_ERROR).send({ message: 'id карточки введен неверно' }));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res.status(NOT_FOUND_ERROR).send({ message: 'id карточки введен неверно' });
    })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(INPUT_ERROR).send({ message: 'Карточка не найдена' }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
