const { DataTypes } = require('sequelize');
const { getConnection } = require('../utils/sqlConnection');

sequelize = getConnection();
const ReviewPlotCount = sequelize.define('ReviewPlotCount', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    value: { type: DataTypes.REAL },
}, {
    // Other model options go here
});

const ReviewPlotsSize = sequelize.define('ReviewPlotsSize', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    value: { type: DataTypes.REAL },
}, {
    // Other model options go here
});

const ReviewTotalChia = sequelize.define('ReviewTotalChia', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    value: { type: DataTypes.REAL },
    blockchain: { type: DataTypes.STRING(70) },
}, {
    // Other model options go here
});

const ReviewNetspaceSize = sequelize.define('ReviewNetspaceSize', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    value: { type: DataTypes.REAL },
    blockchain: { type: DataTypes.STRING(70) },
}, {
    // Other model options go here
});

const ReviewTimeToWin = sequelize.define('ReviewTimeToWin', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    value: { type: DataTypes.REAL },
    blockchain: { type: DataTypes.STRING(70) },
}, {
    // Other model options go here
});

const ReviewPlotsTotalUsed = sequelize.define('ReviewPlotsTotalUsed', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    value: { type: DataTypes.REAL },
    hostname: { type: DataTypes.STRING },
    path: { type: DataTypes.TEXT },
}, {
    // Other model options go here
});

const ReviewPlotsDiskUsed = sequelize.define('ReviewPlotsDiskUsed', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    value: { type: DataTypes.REAL },
    hostname: { type: DataTypes.STRING },
    path: { type: DataTypes.TEXT },
}, {
    // Other model options go here
});

const ReviewPlottingDiskFree = sequelize.define('ReviewPlottingDiskFree', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    value: { type: DataTypes.REAL },
}, {
    // Other model options go here
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





