const { body, validationResult } = require('express-validator');

// Utils
const { AppError } = require('../utils/appError');

// Start User Validations
const createUserValidations = [
  body('name')
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isString()
    .withMessage('Name must be a string'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];
// End User Validations

// Start Character Validations
const createCharacterValidations = [
  body('name')
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isString()
    .withMessage('Name must be a string'),
  body('age')
    .notEmpty()
    .withMessage('Age cannot be empty')
    .isInt({ min: 1 })
    .withMessage('Age must be a number'),
  body('weight')
    .notEmpty()
    .withMessage('Weight cannot be empty')
    .isString()
    .withMessage('Weight must be a string, for example: 10kg'),
  body('history')
    .notEmpty()
    .withMessage('History cannot be empty')
    .isString()
    .withMessage('History must be a string'),
  body('image')
    .custom((value, { req }) => req.file)
    .withMessage('Must provide a valid image'),
];
// End Character Validations

// Start Movie Validations
const createMovieValidations = [
  body('title')
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isString()
    .withMessage('Title must be a string'),
  body('release')
    .notEmpty()
    .withMessage('Release cannot be empty')
    .isDate()
    .withMessage('Release must be a data, for example: 2010-03-20'),
  body('rating')
    .notEmpty()
    .withMessage('Rating cannot be empty')
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('genres')
    .notEmpty()
    .withMessage('Genres cannot be empty')
    .isString()
    .withMessage('Genres must be an array, for example: [1, 2, 3]'),
  body('characters')
    .notEmpty()
    .withMessage('Characters cannot be empty')
    .isString()
    .withMessage('Characters must be an array, for example: [1, 2, 3]'),
  body('image')
    .custom((value, { req }) => req.file)
    .withMessage('Must provide a valid image'),
];
// End User Validations

// Start Genre Validations
const createGenreValidations = [
  body('name')
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isString()
    .withMessage('Name must be a string'),
  body('image')
    .custom((value, { req }) => req.file)
    .withMessage('Must provide a valid image'),
];
// End Genre Validations

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);

    // [msg, msg, msg] -> 'msg. msg. msg'
    const errorMsg = messages.join('. ');

    return next(new AppError(errorMsg, 400));
  }

  next();
};

module.exports = {
  createUserValidations,
  createCharacterValidations,
  createMovieValidations,
  createGenreValidations,
  checkValidations,
};
