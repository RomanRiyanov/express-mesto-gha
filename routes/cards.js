const router = require('express').Router();
const { celebrate } = require('celebrate');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
    owner: Joi.objectId().required(),
    likes: Joi.objectId(),
    createdAt: Joi.date(),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  body: Joi.object().keys({
    owner: Joi.objectId().required(),
  }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    owner: Joi.objectId().required(),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    owner: Joi.objectId().required(),
  }),
}), dislikeCard);

module.exports = router;
