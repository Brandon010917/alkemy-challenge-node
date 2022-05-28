const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Controllers
const { globalErrorHandler } = require('./controllers/error.controller');

// Routers
const { userRouter } = require('./routes/user.routes');
const { authRouter } = require('./routes/auth.routes');
const { characterRouter } = require('./routes/character.routes');
const { movieRouter } = require('./routes/movie.routes');
const { genreRouter } = require('./routes/genre.routes');

// Utils
const { AppError } = require('./utils/appError');

// Init express app
const app = express();

// Enable CORS
app.use(cors());

// Enable incoming JSON data
app.use(express.json());

// Ename incoming form-data
app.use(express.urlencoded({ extended: true }));

// Limit IP requests
const limiter = rateLimit({
  max: 10000,
  windowMs: 1 * 60 * 60 * 1000, // 1 hr
  message: 'Too many requests from this IP',
});

app.use(limiter);

// Endpoints
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/characters', characterRouter);
app.use('/api/v1/movies', movieRouter);
app.use('/api/v1/genres', genreRouter);

// Global error handler
app.use('*', (req, res, next) => {
  return next(
    new AppError(`${req.originalUrl} not found in this server.`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = { app };
