const User = require('../models/user');

// const { INPUT_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require('../utils/constants');

const NotFoundError = require('../errors/not_found_err');
const InputError = require('../errors/input_err');
const AuthorizationError = require('../errors/auth_err');
// const ConflictError = require('../errors/conflict_err');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    // .catch(() => {
    //   res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    // });
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  // const user = req.user._id;

  // if (!user) {
  //   // return res
  //   //   .status(401)
  //   //   .send({ message: 'Пользователь не авторизован' });
  //   next(new AuthorizationError('Необходима авторизация'));
  // }
  User.findById(req.user._id)
    .orFail(() => {
    // const error = new Error('Пользователь по указанному _id не найден');
    // error.statusCode = 404;
    // throw error;
      next(new AuthorizationError('Необходима авторизация'));
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      // const error = new Error('Пользователь по указанному _id не найден');
      // error.statusCode = 404;
      // throw error;
      next(new NotFoundError('Пользователь по указанному _id не найден'));
    })
    .then((user) => res.send({ data: user }))
    // .catch((err) => {
    //   if (err.statusCode === 404) {
    //     res.status(NOT_FOUND_ERROR).send({ message: err.message });
    //   } else if (err.name === 'CastError') {
    //     res.status(INPUT_ERROR).send({ message: 'Переданы некорректный _id профиля' });
    //   } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    // });
    .catch((err) => {
      if (err.statusCode === 404) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else if (err.name === 'CastError') {
        next(new InputError('Переданы некорректный _id профиля'));
      } else next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
    //   const error = new Error('Пользователь по указанному _id не найден');
    //   error.statusCode = 404;
    //   throw error;
      next(new NotFoundError('Пользователь по указанному _id не найден'));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        // res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден' });
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        // res.status(INPUT_ERROR).send({
        // message: 'Переданы некорректные данные при обновлении профиля' });
        next(new InputError('Переданы некорректные данные при обновлении профиля'));
      } else next(err);
      // else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      // const error = new Error('Пользователь по указанному _id не найден');
      // error.statusCode = 404;
      // throw error;
      next(new NotFoundError('Пользователь по указанному _id не найден'));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        // res.status(NOT_FOUND_ERROR).send({ message: err.message });
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        // res.status(INPUT_ERROR).send({
        // message: 'Переданы некорректные данные при обновлении профиля' });
        next(new InputError('Переданы некорректные данные при обновлении профиля'));
      } else next(err);
      // else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUser,
  updateAvatar,
};
