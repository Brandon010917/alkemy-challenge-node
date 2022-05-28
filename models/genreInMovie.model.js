const { DataTypes } = require('sequelize');
const { db } = require('../utils/database');

const GenreInMovie = db.define('genreInMovie', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  genreId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = { GenreInMovie };
