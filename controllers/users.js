const User = require('../models/user');

const INPUT_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const ERROR = 500;

const getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      throw new Error('Пользователей пока нет в базе данных');
    })
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(NOT_FOUND_ERROR).send({ message: 'Пользователей не найдено' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь не найден' });
    })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь не найден' }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (name
    && about
    && avatar
  // && name.length >= 2
  // && name.length <= 30
  //  && about.length >= 2
  //  && about.length <= 30
  ) {
    User.create({ name, about, avatar })
      .then((user) => res.send(user))
      .catch(() => res.status(INPUT_ERROR).send({ message: 'Неверно введены данные' }));
  } else res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь не найден' });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  if (name
     && about
  //  && name.length >= 2 &&
  //  name.length <= 30 &&
  //   about.length >= 2 &&
  //    about.length <= 30
  ) {
    User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
    )
      .orFail(() => {
        throw new Error(`Пользователь с таким _id ${req.user._id} не найден`);
      })
      .then((user) => res.send(user))
      .catch(() => res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь не найден' }));
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
      .catch(() => res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь не найден' }));
  } else res.status(ERROR).send({ message: 'Неверно введены данные' });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
