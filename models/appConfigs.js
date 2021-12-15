const { DataTypes } = require('sequelize');

const { getConnection } = require('../utils/sqlConnection');

const sequelize = getConnection();
const AppConfig = sequelize.define('AppConfig', {
  key: { type: DataTypes.STRING(70), primaryKey: true },
  value: { type: DataTypes.STRING },
}, {

});

const syncTable = async () => {
  await AppConfig.sync();
};
syncTable();

module.exports = {
  AppConfig
};