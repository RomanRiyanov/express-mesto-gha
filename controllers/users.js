const createError = require('http-errors');
const User = require('../models/user');
const { errorHandler } = require('../utils/utils');

// const INPUT_ERROR = 400;
// const NOT_FOUND_ERROR = 404;
// const DEFAULT_ERROR = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => errorHandler(err, res));
  // res.status(DEFAULT_ERROR).send({ message: 'Пользователей не найдено' })
  // );
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw createError(404, 'Пользователь с указанным _id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      errorHandler(err, res);
      // if (err.name === 'NotFoundError') {
      //   res.status(NOT_FOUND_ERROR).send({ message: err.message });
      // } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      errorHandler(err, res);
      // if (err.name === 'ValidationError') {
      //   res.status(INPUT_ERROR)
      // .send({ message: 'Переданы некорректные данные при создании пользователя' });
      // } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

const updateUser = (req, res) => {
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
      throw createError(404, 'Пользователь с указанным _id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      errorHandler(err, res);
      // if (err.name === 'NotFoundError') {
      //   res.status(NOT_FOUND_ERROR).send({ message: err.message });
      // } else if (err.name === 'ValidationError') {
      //   res.status(INPUT_ERROR)
      // .send({ message: 'Переданы некорректные данные при обновлении профиля' });
      // } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

const updateAvatar = (req, res) => {
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
      throw createError(404, 'Пользователь с указанным _id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      errorHandler(err, res);
      // if (err.name === 'NotFoundError') {
      //   res.status(NOT_FOUND_ERROR).send({ message: err.message });
      // } else if (err.name === 'ValidationError') {
      //   res.status(INPUT_ERROR)
      // .send({ message: 'Переданы некорректные данные при обновлении профиля' });
      // } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
