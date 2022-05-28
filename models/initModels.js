const { Character } = require('./character.model');
const { CharacterInMovie } = require('./characterInMovie.model');
const { Genre } = require('./genre.model');
const { GenreInMovie } = require('./genreInMovie.model');
const { Movie } = require('./movie.model');

// Establish your models relations inside this function
const initModels = () => {
  // M Movies <-----> M Character
  Movie.belongsToMany(Character, { through: CharacterInMovie });
  Character.belongsToMany(Movie, { through: CharacterInMovie });

  // M Movies <-----> M Genre
  Movie.belongsToMany(Genre, { through: GenreInMovie });
  Genre.belongsToMany(Movie, { through: GenreInMovie });
};

module.exports = { initModels };
