const { DataTypes } = require('sequelize');
const { db } = require('../utils/database');

const CharacterInMovie = db.define('characterInMovie', {
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
  characterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = { CharacterInMovie };
