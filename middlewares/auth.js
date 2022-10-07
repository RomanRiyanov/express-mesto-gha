/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'd68261db864dad0fba0061a8ce2e86fc1828d43a1a59041d8314b10261a85412' } = process.env;

const AuthorizationError = require('../errors/auth_err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new AuthorizationError('Необходима авторизация'));
    return;
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthorizationError('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};
