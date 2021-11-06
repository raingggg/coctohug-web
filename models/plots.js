const { DataTypes } = require('sequelize');
const { getConnection } = require('../utils/sqlConnection');

sequelize = getConnection();
const Plot = sequelize.define('Plot', {
    hostname: { type: DataTypes.STRING, primaryKey: true },
    plot_id: { type: DataTypes.STRING(32), primaryKey: true },
    displayname: { type: DataTypes.STRING },
    blockchain: { type: DataTypes.STRING(70) },
    type: { type: DataTypes.STRING(32) },
    dir: { type: DataTypes.STRING },
    file: { type: DataTypes.STRING },
    size: { type: DataTypes.INTEGER },
}, {
    // Other model options go here
});

module.exports = {
    Plot
};
