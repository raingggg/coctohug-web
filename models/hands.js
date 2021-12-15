const { DataTypes } = require('sequelize');

const { getConnection } = require('../utils/sqlConnection');

const sequelize = getConnection();
const Hand = sequelize.define('Hand', {
  hostname: { type: DataTypes.STRING, primaryKey: true },
  blockchain: { type: DataTypes.STRING(70), primaryKey: true },
  mode: { type: DataTypes.STRING(70) },
  url: { type: DataTypes.TEXT },
  versions: { type: DataTypes.TEXT },
}, {

});

const syncTable = async () => {
  await Hand.sync();
};
syncTable();

module.exports = {
  Hand
};
