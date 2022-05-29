const express = require('express');

// Controllers
const {
  createGenre,
  getAllGenres,
} = require('../controllers/genre.controllers');

// Middlewares
const { protectToken } = require('../middlewares/auth.middlewares');
const {
  createGenreValidations,
  checkValidations,
} = require('../middlewares/validation.middlewares');

// Utils
const { upload } = require('../utils/multer');

const router = express.Router();

// Apply protectToken middleware
router.use(protectToken);

router.post(
  '/',
  upload.single('image'),
  createGenreValidations,
  checkValidations,
  createGenre
);

router.get('/', getAllGenres);

module.exports = {
  genreRouter: router,
};
