const { DataTypes } = require('sequelize');
const db_connect = require('../db/connf');

const ReBalance = db_connect.define(
  'ReBalanceConfig',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    re_balance_id: {
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
    asset_ratio: {
      type: DataTypes.REAL,
      allowNull: false
    },
    cash_ratio: {
      type: DataTypes.REAL,
      allowNull: false
    },
    difference: {
      type: DataTypes.REAL,
      allowNull: false
    }
  },
  {
    tableName: 're_balance_config',
    timestamps: false
  }
)

module.exports = ReBalance
