const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const InputError = require('../errors/input_err');
const AuthorizationError = require('../errors/auth_err');
const ConflictError = require('../errors/conflict_err');

const { JWT_SECRET = 'd68261db864dad0fba0061a8ce2e86fc1828d43a1a59041d8314b10261a85412' } = process.env;

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InputError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже зарегестрирован'));
      } else next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByEmailAndPass(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ email, password });
    })
    .catch(() => {
      res.cookie('jwt', '', { expires: new Date() });
      next(new AuthorizationError('Необходима авторизация'));
    });
};

module.exports = {
  createUser,
  login,
};
