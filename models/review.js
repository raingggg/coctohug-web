const { DataTypes } = require('sequelize');

const { getConnection } = require('../utils/sqlConnection');

sequelize = getConnection();
const ReviewPlotCount = sequelize.define('ReviewPlotCount', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  value: { type: DataTypes.REAL },
}, {
  
});

const ReviewPlotsSize = sequelize.define('ReviewPlotsSize', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  value: { type: DataTypes.REAL },
}, {
  
});

const ReviewTotalChia = sequelize.define('ReviewTotalChia', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  value: { type: DataTypes.REAL },
  blockchain: { type: DataTypes.STRING(70) },
}, {
  
});

const ReviewNetspaceSize = sequelize.define('ReviewNetspaceSize', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  value: { type: DataTypes.REAL },
  blockchain: { type: DataTypes.STRING(70) },
}, {
  
});

const ReviewTimeToWin = sequelize.define('ReviewTimeToWin', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  value: { type: DataTypes.REAL },
  blockchain: { type: DataTypes.STRING(70) },
}, {
  
});

const ReviewPlotsTotalUsed = sequelize.define('ReviewPlotsTotalUsed', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  value: { type: DataTypes.REAL },
  hostname: { type: DataTypes.STRING },
  path: { type: DataTypes.TEXT },
}, {
  
});

const ReviewPlotsDiskUsed = sequelize.define('ReviewPlotsDiskUsed', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  value: { type: DataTypes.REAL },
  hostname: { type: DataTypes.STRING },
  path: { type: DataTypes.TEXT },
}, {
  
});

const ReviewPlottingDiskFree = sequelize.define('ReviewPlottingDiskFree', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  value: { type: DataTypes.REAL },
}, {
  
});

module.exports = {
  ReviewPlotCount,
  ReviewPlotsSize,
  ReviewTotalChia,
  ReviewNetspaceSize,
  ReviewTimeToWin,
  ReviewPlotsTotalUsed,
  ReviewPlotsDiskUsed,
  ReviewPlottingDiskFree,
};





