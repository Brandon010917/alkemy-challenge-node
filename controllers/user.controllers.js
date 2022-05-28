const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Models
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const { filterObj } = require('../utils/filterObj');

dotenv.config({ path: './config.env' });

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
  });

  res.status(200).json({
    status: 'success',
    users,
  });
});

const getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    status: 'success',
    user,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const data = filterObj(req.body, 'name', 'email', 'password');

  // Check if the user wants to change the password
  if (data.password) {
    if (data.password.length < 8) {
      return next(
        new AppError('Password must be at least 8 characters long', 404)
      );
    }

    // Generate a new hashed password
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(data.password, salt);

    data.password = hashPassword;
  }

  await user.update({ ...data });

  res.status(200).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(200).json({
    status: 'success',
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
