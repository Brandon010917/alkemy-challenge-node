const express = require('express');

// Controllers
const { register, login } = require('../controllers/auth.controllers');

// Middlewares
const {
  createUserValidations,
  checkValidations,
} = require('../middlewares/validation.middlewares');

const router = express.Router();

router.post('/register', createUserValidations, checkValidations, register);

router.post('/login', login);

module.exports = {
  authRouter: router,
};
