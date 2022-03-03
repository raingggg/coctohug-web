const { DataTypes } = require('sequelize');

const { getConnection } = require('../utils/sqlConnection');

const sequelize = getConnection();
const WeeklyReport = sequelize.define('WeeklyReport', {
  unique_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  hostname: { type: DataTypes.STRING },
  blockchain: { type: DataTypes.STRING(70) },
  symbol: { type: DataTypes.STRING(70) },
  coins: { type: DataTypes.REAL, defaultValue: 0 },
  percent: { type: DataTypes.REAL, defaultValue: 0 },

  // extend columns
  ext_num_1: { type: DataTypes.REAL, defaultValue: 0 },
  ext_num_2: { type: DataTypes.REAL, defaultValue: 0 },
  ext_num_3: { type: DataTypes.REAL, defaultValue: 0 },
  ext_str_1: { type: DataTypes.STRING },
  ext_str_2: { type: DataTypes.STRING },
  ext_str_3: { type: DataTypes.STRING },
  ext_str_4: { type: DataTypes.STRING },
  ext_str_5: { type: DataTypes.STRING },
}, {

  });

const syncTable = async () => {
  await WeeklyReport.sync();
};
syncTable();

module.exports = {
  WeeklyReport
};
