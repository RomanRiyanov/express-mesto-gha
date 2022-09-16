const User = require('../models/user');

const { INPUT_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(INPUT_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error('Пользователь по указанному _id не найден');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(INPUT_ERROR).send({ message: 'Переданы некорректный _id профиля' });
      } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(INPUT_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
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
      const error = new Error('Пользователь по указанному _id не найден');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(INPUT_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
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
      const error = new Error('Пользователь по указанному _id не найден');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(INPUT_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
