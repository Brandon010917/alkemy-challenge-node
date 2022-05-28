const express = require('express');

// Controllers
const {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require('../controllers/movie.controllers');

// Middlewares
const { protectToken } = require('../middlewares/auth.middlewares');
const {
  movieExists,
  protectMovieOwner,
} = require('../middlewares/movie.middlewares');
const {
  createMovieValidations,
  checkValidations,
} = require('../middlewares/validation.middlewares');

// Utils
const { upload } = require('../utils/multer');

const router = express.Router();

// Apply middlewares protectToken
router.use(protectToken);

router.post(
  '/',
  upload.single('image'),
  createMovieValidations,
  checkValidations,
  createMovie
);

router.get('/', getAllMovies);

router
  .use('/:id', movieExists)
  .route('/:id')
  .get(getMovieById)
  .patch(protectMovieOwner, updateMovie)
  .delete(protectMovieOwner, deleteMovie);

module.exports = {
  movieRouter: router,
};
