const User = require('../models/user');

const INPUT_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const ERROR = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((error) => res.status(NOT_FOUND_ERROR).send({ message: 'Пользователей не найдено' }, error));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((error) => res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь не найден' }, error));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (name && about && avatar && name.length >= 2 && name.length <= 30) {
    User.create({ name, about, avatar })
      .then((user) => res.send(user))
      .catch((error) => res.status(INPUT_ERROR).send({ message: 'Пользователь не найден' }, error));
  } else res.status(INPUT_ERROR).send({ message: 'Неверно введены данные' });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  if (name && about && name.length >= 2 && name.length <= 30) {
    User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
    )
      .then((user) => res.send(user))
      .catch((error) => res.status(INPUT_ERROR).send({ message: 'Пользователь не найден' }, error));
  } else res.status(INPUT_ERROR).send({ message: 'Неверно введены данные' });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  if (avatar) {
    User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
    )
      .then((user) => res.send(user))
      .catch((error) => res.status(INPUT_ERROR).send({ message: 'Пользователь не найден' }, error));
  } else res.status(ERROR).send({ message: 'Неверно введены данные' });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
