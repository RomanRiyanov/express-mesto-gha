/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
const AuthorizationError = require('../errors/auth_err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
    throw new AuthorizationError('Необходима авторизация');
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
    throw new AuthorizationError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
