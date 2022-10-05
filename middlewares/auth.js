/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

// const { JWT_SECRET } = process.env;
const { JWT_SECRET = 'd68261db864dad0fba0061a8ce2e86fc1828d43a1a59041d8314b10261a85412' } = process.env;
// const JWT_SECRET = 'd68261db864dad0fba0061a8ce2e86fc1828d43a1a59041d8314b10261a85412';

const AuthorizationError = require('../errors/auth_err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
    throw new AuthorizationError('Необходима авторизация');
  }

  // const { authorization } = req.headers;

  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   return res
  //     .status(401)
  //     .send({ message: 'Необходима авторизация' });
  // }

  // const token = authorization.replace('Bearer ', '');

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
