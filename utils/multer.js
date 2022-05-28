const multer = require('multer');

// Utils
const { AppError } = require('./appError');

const storage = multer.memoryStorage();

const multerFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) {
    cb(new AppError('Must provide a image as a file', 404), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter: multerFileFilter,
});

module.exports = { upload };
