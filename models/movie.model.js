const { DataTypes } = require('sequelize');
const { db } = require('../utils/database');

const Movie = db.define('movie', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  release: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  rating: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  createByUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
  },
});

module.exports = { Movie };
