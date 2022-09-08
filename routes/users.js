const router = require('express').Router();

const { getUsers, getUserById, createUser } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users:userId', getUserById);
router.post('/', createUser);

module.exports = router;
