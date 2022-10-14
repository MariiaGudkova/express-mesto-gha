const router = require('express').Router();
const {
  getUsers, getUserById, createUser, updateUserProfile, updateUserProfileAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.post('/', createUser);

router.patch('/me', updateUserProfile);

router.patch('/me/avatar', updateUserProfileAvatar);

module.exports = router;
