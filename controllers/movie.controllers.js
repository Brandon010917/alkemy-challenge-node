const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { Character } = require('../models/character.model');

// Models
const { CharacterInMovie } = require('../models/characterInMovie.model');
const { Genre } = require('../models/genre.model');
const { GenreInMovie } = require('../models/genreInMovie.model');
const { Movie } = require('../models/movie.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { filterObj } = require('../utils/filterObj');
const { storage } = require('../utils/firebase');

const createMovie = catchAsync(async (req, res, next) => {
  const { title, release, rating, characters, genres } = req.body;
  const { sessionUser } = req;

  const parseCharacters = JSON.parse(characters);
  const parseGenres = JSON.parse(genres);

  const imgRef = ref(
    storage,
    `images/movies/${Date.now()}-${req.file.originalname}`
  );

  const imgUploaded = await uploadBytes(imgRef, req.file.buffer);

  const newMovie = await Movie.create({
    title,
    release,
    rating,
    image: imgUploaded.metadata.fullPath,
    createByUser: sessionUser.id,
  });

  const charactersInMoviesPromises = parseCharacters.map(async characterId => {
    return CharacterInMovie.create({ characterId, movieId: newMovie.id });
  });

  const genresInMoviesPromises = parseGenres.map(async genreId => {
    return GenreInMovie.create({ genreId, movieId: newMovie.id });
  });

  await Promise.all([...charactersInMoviesPromises, ...genresInMoviesPromises]);

  res.status(201).json({
    status: 'success',
    newMovie,
  });
});

const getAllMovies = catchAsync(async (req, res, next) => {
  const movies = await Movie.findAll({
    where: {
      status: 'active',
    },
  });

  const moviesPromises = movies.map(async ({ id, image, title, release }) => {
    const imageRef = ref(storage, image);
    const imgDownloadUrl = await getDownloadURL(imageRef);

    return {
      id,
      image: imgDownloadUrl,
      title,
      release,
    };
  });

  const resolvedMovies = await Promise.all(moviesPromises);

  res.status(200).json({
    status: 'success',
    movies: resolvedMovies,
  });
});

const getMovieById = catchAsync(async (req, res, next) => {
  const { movie } = req;

  const imgRef = ref(storage, movie.image);
  const imgDownloadUrl = await getDownloadURL(imgRef);

  movie.image = imgDownloadUrl;

  movie.createByUser = undefined;

  res.status(200).json({
    status: 'success',
    movie,
  });
});

const updateMovie = catchAsync(async (req, res, next) => {
  const data = filterObj(req.body, 'title', 'release', 'rating');
  const { movie } = req;

  await movie.update({
    ...data,
  });

  res.status(200).json({
    status: 'updated',
  });
});

const deleteMovie = catchAsync(async (req, res, next) => {
  const { movie } = req;

  await movie.update({
    status: 'deleted',
  });

  res.status(200).json({
    status: 'deleted',
  });
});

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
};
