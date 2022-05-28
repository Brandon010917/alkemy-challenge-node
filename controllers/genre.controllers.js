const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

// Models
const { Genre } = require('../models/genre.model');
const { Movie } = require('../models/movie.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { storage } = require('../utils/firebase');

const createGenre = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const imgRef = ref(
    storage,
    `images/genres/${Date.now()}-${req.file.originalname}`
  );
  const imgUploaded = await uploadBytes(imgRef, req.file.buffer);

  const newGenre = await Genre.create({
    name,
    image: imgUploaded.metadata.fullPath,
  });

  res.status(201).json({
    status: 'success',
    newGenre,
  });
});

const getAllGenres = catchAsync(async (req, res, next) => {
  const genres = await Genre.findAll({
    where: {
      status: 'active',
    },
    include: [
      {
        model: Movie,
        attributes: ['id', 'title', 'release'],
      },
    ],
  });

  const genresPromises = genres.map(async ({ id, name, image, movies }) => {
    const imgRef = ref(storage, image);
    const imgDownloadUrl = await getDownloadURL(imgRef);

    return {
      id,
      name,
      image: imgDownloadUrl,
      movies,
    };
  });

  const resolvedGenres = await Promise.all(genresPromises);

  res.status(200).json({
    status: 'success',
    genres: resolvedGenres,
  });
});

module.exports = {
  createGenre,
  getAllGenres,
};
