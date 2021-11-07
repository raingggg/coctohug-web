const { DataTypes } = require('sequelize');
const { getConnection } = require('../utils/sqlConnection');

sequelize = getConnection();
const Farm = sequelize.define('Farm', {
    hostname: { type: DataTypes.STRING, primaryKey: true },
    blockchain: { type: DataTypes.STRING(70), primaryKey: true },
    mode: { type: DataTypes.STRING(70) },
    status: { type: DataTypes.STRING(128) },
    plot_count: { type: DataTypes.INTEGER },
    plots_size: { type: DataTypes.REAL },
    total_coins: { type: DataTypes.REAL },
    netspace_size: { type: DataTypes.REAL },
    expected_time_to_win: { type: DataTypes.STRING(64) },
}, {
    // Other model options go here
});

module.exports = {
    Farm
};