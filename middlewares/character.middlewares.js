// Models
const { Character } = require('../models/character.model');
const { Movie } = require('../models/movie.model');

// Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

const characterExits = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const character = await Character.findOne({
    where: { id, status: 'active' },
    attributes: {
      exclude: ['status', 'createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Movie,
        attributes: ['id', 'title', 'release', 'rating'],
      },
    ],
  });

  if (!character) return next(new AppError('Character not found', 404));

  req.character = character;

  next();
});

const protectCharacterOwner = catchAsync(async (req, res, next) => {
  // Get current session user and the character that is going to be updated
  const { sessionUser, character } = req;

  // Compare the id's
  if (sessionUser.id !== character.createByUser) {
    // If the ids aren't equal, return error
    return next(new AppError('You do not own this character', 403));
  }

  character.createByUser = undefined;

  next();
});

module.exports = { characterExits, protectCharacterOwner };
