const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((error) => res.send({ message: error }));
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((users) => res.send(users))
    .catch((error) => res.send({ message: error }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
