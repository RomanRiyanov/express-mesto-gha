const router = require('express').Router();
const { celebrate } = require('celebrate');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const {
  getUsers, getUserById, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

router.get(
  '/', /* celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().
    password: Joi.string().min(8),
  }),
}), */ getUsers,
);
router.get(
  '/me',
  // celebrate({
  //   user: Joi.object().keys({
  //     _id: Joi.string().alphanum().length(24),
  //   }),
  // }),
  getCurrentUser,
);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^http(s)?:\/\/(www.)?([0-9A-Za-z.@:%_/+-~#=]+)+(.[a-zA-Z]{2,3})(\/[0-9A-Za-z.@:%_/+-~#=]+)*$/),
  }),
}), updateAvatar);

module.exports = router;
// name: {
//   type: String,
//   default: 'Жак-Ив Кусто',
//   minlength: 2,
//   maxlength: 30,
// },
// about: {
//   type: String,
//   default: 'Исследователь',
//   minlength: 2,
//   maxlength: 30,
// },
// avatar: {
//   type: String,
//   default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
// },
// email: {
//   type: String,
//   required: true,
//   unique: true,
//   validate: {
//     validator(v) {
//       return validator.isEmail(v);
//     },
//     message: 'Неправильно введен email',
//   },
// },
// password: {
//   type: String,
//   required: true,
//   minlength: 8,
//   select: false,
// },
