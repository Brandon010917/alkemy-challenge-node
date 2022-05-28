const express = require('express');

const router = express.Router();

// Controllers
const { register, login } = require('../controllers/auth.controllers');

// Middlewares
const {
  createUserValidations,
  checkValidations,
} = require('../middlewares/validation.middlewares');

router.post('/register', createUserValidations, checkValidations, register);

router.post('/login', login);

module.exports = {
  authRouter: router,
};
