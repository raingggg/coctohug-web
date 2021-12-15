const { DataTypes } = require('sequelize');

const { getConnection } = require('../utils/sqlConnection');

const sequelize = getConnection();
const Wallet = sequelize.define('Wallet', {
  hostname: { type: DataTypes.STRING, primaryKey: true },
  blockchain: { type: DataTypes.STRING(70), primaryKey: true },
  details: { type: DataTypes.TEXT },
  coldWallet: { type: DataTypes.STRING }
}, {

});

const syncTable = async () => {
  await Wallet.sync();
};
syncTable();

module.exports = {
  Wallet
};