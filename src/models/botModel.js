const { DataTypes } = require('sequelize');
const db_connect = require('../db/connf');

const BotConfig = db_connect.define(
  'BotConfig',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type_id: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        is: /^G-|^R-|^T-|^AI-/
      }
    },
    type_bot: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isIn: [['Grid', 'Rebalance', 'Technical', 'AI']]
      }
    },
    bot_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
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
    }
  },
  {
    tableName: 'bot_config',
    timestamps: true
  }
)

module.exports = BotConfig
