const { DataTypes } = require('sequelize');

const { getConnection } = require('../utils/sqlConnection');

const sequelize = getConnection();
const FarmDetail = sequelize.define('FarmDetail', {
  hostname: { type: DataTypes.STRING, primaryKey: true },
  blockchain: { type: DataTypes.STRING(70), primaryKey: true },
  details: { type: DataTypes.TEXT },
}, {

});

const syncTable = async () => {
  await FarmDetail.sync();
};
syncTable();

module.exports = {
  FarmDetail
};