const router = require('express').Router();
// const { celebrate } = require('celebrate');
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
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

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
