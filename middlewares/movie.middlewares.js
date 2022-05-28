// Models
const { Character } = require('../models/character.model');
const { Genre } = require('../models/genre.model');
const { Movie } = require('../models/movie.model');

// Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

const movieExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const movie = await Movie.findOne({
    where: { id, status: 'active' },
    attributes: {
      exclude: ['status', 'createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Character,
        attributes: ['id', 'name', 'age', 'weight', 'history'],
      },
      {
        model: Genre,
        attributes: ['id', 'name'],
      },
    ],
  });

  if (!movie) {
    return next(new AppError('Movie does not exist with given Id', 404));
  }

  // Add movie data to the req object
  req.movie = movie;
  next();
});

const protectMovieOwner = catchAsync(async (req, res, next) => {
  // Get current session movie and the user that is going to be updated
  const { sessionUser, movie } = req;

  // Compare the id's
  if (sessionUser.id !== movie.createByUser) {
    // If the ids aren't equal, return error
    return next(new AppError('You do not own this account', 403));
  }

  movie.createByUser = undefined;

  // If the ids are equal, the request pass
  next();
});

module.exports = {
  movieExists,
  protectMovieOwner,
};
