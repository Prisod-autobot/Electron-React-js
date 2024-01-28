const { Sequelize } = require('sequelize');

const db_connect = new Sequelize({
    dialect: 'sqlite',
    storage: './database_bot.db'
});

module.exports = db_connect;
