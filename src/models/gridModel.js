const { DataTypes } = require('sequelize');
const db_connect = require('../db/connf');

const Grid = db_connect.define(
  'GridConfig',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    grid_id: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    bot_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    api_key: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    api_secret: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pair: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    exchange_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    budget: {
      type: DataTypes.REAL,
      allowNull: false
    },
    up_zone: {
      type: DataTypes.REAL,
      allowNull: false
    },
    low_zone: {
      type: DataTypes.REAL,
      allowNull: false
    },
    amount: {
      type: DataTypes.REAL,
      allowNull: false
    },
    grid_qty: {
      type: DataTypes.INTEGER
    },
    grid_step: {
      type: DataTypes.INTEGER
    },
    type_zone_calculation: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'grid_config',
    timestamps: true
  }
)

module.exports = Grid
