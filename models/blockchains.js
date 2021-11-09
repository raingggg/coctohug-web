const { DataTypes } = require('sequelize');
const { getConnection } = require('../utils/sqlConnection');

sequelize = getConnection();
const Blockchain = sequelize.define('Blockchain', {
  hostname: { type: DataTypes.STRING, primaryKey: true },
  blockchain: { type: DataTypes.STRING(70), primaryKey: true },
  details: { type: DataTypes.TEXT },
}, {
  // Other model options go here
});

const syncTable = async () => {
  await Blockchain.sync();
};
syncTable();

module.exports = {
  Blockchain
};