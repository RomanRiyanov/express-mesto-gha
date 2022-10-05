const Card = require('../models/card');

// const { INPUT_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require('../utils/constants');

const NotFoundError = require('../errors/not_found_err');
const InputError = require('../errors/input_err');
const ForbiddenError = require('../errors/forbidden_err');
// const AuthorizationError = require('../errors/auth_err');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      // res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(INPUT_ERROR).send({
        // message: 'Переданы некорректные данные при создании карточки' });
        next(new InputError('Переданы некорректные данные при создании карточки'));
      } else next(err);
      // else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

// const deleteCard = (req, res, next) => {
//   // const { cardId } = req.params.cardId;
//   const userId = req.user._id;

//   console.log(`userId ${userId}`);
//   console.log(`req.params.cardId ${req.params.cardId}`);

//   // console.log(card.owner);

//   Card.findById(req.params.cardId)
//     .orFail(() => {
//     // const error = new Error('Передан несуществующий _id карточки');
//     // error.statusCode = 404;
//     // throw error;
//       next(new NotFoundError('Передан несуществующий _id карточки'));
//     })
//     .then((card) => {
//       console.log(`userId ${userId}`);
//       console.log(`card.owner ${card.owner}`);
//       if (userId !== card.owner) {
//         next(new ForbiddenError('Нельзя удалять чужую карточку'));
//       }
//       Card.findOneAndRemove({ _id: req.params.cardId })
//         .then((selectedCard) => res.send({ data: selectedCard }));
//     })
//     // .catch((err) => {
//     //   if (err.statusCode === 404) {
//     //     res.status(NOT_FOUND_ERROR).send({ message: err.message });
//     //   } else if (err.name === 'CastError') {
//     //     res.status(INPUT_ERROR).send({ message: 'Переданы некорректный _id карточки' });
//     //   } else res.status(NOT_FOUND_ERROR).send({ message: err.message });
//     // });
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new InputError('Переданы некорректный _id карточки'));
//       } else next(err);
//     });
// };
const deleteCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      console.log(card.owner._id);
      const owner = card.owner._id.toString();
      console.log(owner);

      if (owner !== userId) {
        next(new ForbiddenError('Нельзя удалять чужую карточку'));
      }
      Card.findByIdAndDelete(cardId)
        .then((cardSelected) => res.send({ data: cardSelected }));
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      // const error = new Error('Передан несуществующий _id карточки');
      // error.statusCode = 404;
      // throw error;
      next(new NotFoundError('Передан несуществующий _id карточки'));
    })
    .then((card) => res.send({ data: card }))
    // .catch((err) => {
    //   if (err.statusCode === 404) {
    //     res.status(NOT_FOUND_ERROR).send({ message: err.message });
    //   } else if (err.name === 'ValidationError' || err.name === 'CastError') {
    //     res.status(INPUT_ERROR).send({
  // message: 'Переданы некорректные данные для постановки/снятии лайка' });
    //   } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    // });
    .catch((err) => {
      if (err.statusCode === 404) {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
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
      // const error = new Error('Передан несуществующий _id карточки');
      // error.statusCode = 404;
      // throw error;
      next(new NotFoundError('Передан несуществующий _id карточки'));
    })
    .then((card) => res.send({ data: card }))
    // .catch((err) => {
    //   if (err.statusCode === 404) {
    //     res.status(NOT_FOUND_ERROR).send({ message: err.message });
    //   } else if (err.name === 'ValidationError' || err.name === 'CastError') {
    //     res.status(INPUT_ERROR).send({
  // message: 'Переданы некорректные данные для постановки/снятии лайка' });
    //   } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    // });
    .catch((err) => {
      if (err.statusCode === 404) {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
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
