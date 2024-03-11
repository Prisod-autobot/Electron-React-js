const { DataTypes } = require('sequelize');
const db_connect = require('../db/connf');

const ReBalanceHistory = db_connect.define(
  'HistoryReBalance',
  {
    bot_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_transaction: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Asset_value: {
      type: DataTypes.REAL,
      allowNull: false
    },
    Cash_value: {
      type: DataTypes.REAL,
      allowNull: false
    },
    Price: {
      type: DataTypes.REAL,
      allowNull: false
    },
    Amount_asset: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Last_asset_value: {
      type: DataTypes.REAL,
      allowNull: false
    },
    Rebalance_difference: {
      type: DataTypes.REAL,
      allowNull: false
    }

  },
  {
    tableName: 're_balance_db',
    timestamps: true
  }
)

module.exports = ReBalanceHistory
