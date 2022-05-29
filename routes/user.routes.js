const express = require('express');

// Controllers
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/user.controllers');

// Middlewares
const { protectToken } = require('../middlewares/auth.middlewares');
const {
  userExists,
  protectAccountOwner,
} = require('../middlewares/user.middlewares');

const router = express.Router();

// Apply protectToken middleware
router.use(protectToken);

router.get('/', getAllUsers);

router
  .use('/:id', userExists)
  .route('/:id')
  .get(getUserById)
  .patch(protectAccountOwner, updateUser)
  .delete(protectAccountOwner, deleteUser);

module.exports = { userRouter: router };
