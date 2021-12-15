const { DataTypes } = require('sequelize');

const { getConnection } = require('../utils/sqlConnection');

const sequelize = getConnection();
const Plotnft = sequelize.define('Plotnft', {
  hostname: { type: DataTypes.STRING, primaryKey: true },
  blockchain: { type: DataTypes.STRING(70), primaryKey: true },
  details: { type: DataTypes.TEXT },
}, {
  
});

module.exports = {
  Plotnft
};