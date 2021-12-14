const { DataTypes } = require('sequelize');

const { getConnection } = require('../utils/sqlConnection');

sequelize = getConnection();
const WalletBalance = sequelize.define('WalletBalance', {
  blockchain: { type: DataTypes.STRING(70), primaryKey: true },
  address: { type: DataTypes.STRING, primaryKey: true },
  balance: { type: DataTypes.REAL },
  price: { type: DataTypes.REAL },
  total_price: { type: DataTypes.REAL },
}, {

});

const syncTable = async () => {
  await WalletBalance.sync();
};
syncTable();

module.exports = {
  WalletBalance
};