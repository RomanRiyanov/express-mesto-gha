const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// const { INPUT_ERROR, DEFAULT_ERROR } = require('../utils/constants');

// const NotFoundError = require('../errors/not_found_err');
const InputError = require('../errors/input_err');
const AuthorizationError = require('../errors/auth_err');
const ConflictError = require('../errors/conflict_err');

const { JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(INPUT_ERROR).send({
        // message: 'Переданы некорректные данные при создании пользователя' });
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
          maxAge: 3600 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch(() => {
      res.cookie('jwt', '', { expires: new Date() });
      // res.status(401).send({ message: err.message });
      next(new AuthorizationError('Необходима авторизация'));
    });
};

module.exports = {
  createUser,
  login,
};
