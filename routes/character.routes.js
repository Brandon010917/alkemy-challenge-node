const express = require('express');

// Controllers
const {
  createCharacter,
  getAllCharacters,
  getCharacterById,
  updateCharacter,
  deleteCharacter,
} = require('../controllers/character.controllers');

// Middlewares
const { protectToken } = require('../middlewares/auth.middlewares');
const {
  characterExits,
  protectCharacterOwner,
} = require('../middlewares/character.middlewares');
const {
  createCharacterValidations,
  checkValidations,
} = require('../middlewares/validation.middlewares');

// Utils
const { upload } = require('../utils/multer');

const router = express.Router();

router.use(protectToken);

router.post(
  '/',
  upload.single('image'),
  createCharacterValidations,
  checkValidations,
  createCharacter
);

router.get('/', getAllCharacters);

router
  .use('/:id', characterExits)
  .route('/:id')
  .get(getCharacterById)
  .patch(protectCharacterOwner, updateCharacter)
  .delete(protectCharacterOwner, deleteCharacter);

module.exports = {
  characterRouter: router,
};
