const { DataTypes } = require('sequelize');

const { getConnection } = require('../utils/sqlConnection');

sequelize = getConnection();
const Wallet = sequelize.define('Wallet', {
  hostname: { type: DataTypes.STRING, primaryKey: true },
  blockchain: { type: DataTypes.STRING(70), primaryKey: true },
  details: { type: DataTypes.TEXT },
}, {
  
});

const syncTable = async () => {
  await Wallet.sync();
};
syncTable();

module.exports = {
  Wallet
};