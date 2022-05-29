// Firebase/storage
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

// Models
const { Character } = require('../models/character.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { filterObj } = require('../utils/filterObj');
const { storage } = require('../utils/firebase');

const createCharacter = catchAsync(async (req, res) => {
  const { name, age, weight, history } = req.body;
  const { sessionUser } = req;

  const imgRef = ref(
    storage,
    `images/charactes/${Date.now()}-${req.file.originalname}`
  );

  const imgUploaded = await uploadBytes(imgRef, req.file.buffer);

  const newCharacter = await Character.create({
    name,
    age,
    weight,
    history,
    image: imgUploaded.metadata.fullPath,
    createByUser: sessionUser.id,
  });

  res.status(201).json({
    status: 'success',
    newCharacter,
  });
});

const getAllCharacters = catchAsync(async (req, res, next) => {
  const characters = await Character.findAll({
    where: {
      status: 'active',
    },
    attributes: ['id', 'name', 'image'],
  });

  const charactersPromises = characters.map(async ({ id, name, image }) => {
    const imgRef = ref(storage, image);
    const imgDownloadUrl = await getDownloadURL(imgRef);

    return {
      id,
      name,
      image: imgDownloadUrl,
    };
  });

  const resolvedCharacters = await Promise.all(charactersPromises);

  res.status(200).json({
    status: 'success',
    characters: resolvedCharacters,
  });
});

const getCharacterById = catchAsync(async (req, res) => {
  const { character } = req;

  const imgRef = ref(storage, character.image);
  const imgDownloadUrl = await getDownloadURL(imgRef);

  character.image = imgDownloadUrl;

  character.createByUser = undefined;

  res.status(200).json({
    status: 'success',
    character,
  });
});

const updateCharacter = catchAsync(async (req, res) => {
  const data = filterObj(req.body, 'name', 'age', 'weight', 'history');
  const { character } = req;

  await character.update({
    ...data,
  });

  res.status(200).json({
    status: 'updated',
  });
});

const deleteCharacter = catchAsync(async (req, res) => {
  const { character } = req;

  await character.update({
    status: 'deleted',
  });

  res.status(200).json({
    status: 'deleted',
  });
});

module.exports = {
  createCharacter,
  getAllCharacters,
  getCharacterById,
  updateCharacter,
  deleteCharacter,
};
