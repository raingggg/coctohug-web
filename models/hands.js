const { DataTypes } = require('sequelize');
const { getConnection } = require('../utils/sql-connection');

sequelize = getConnection();
const Hand = sequelize.define('Hand', {
    hostname: { type: DataTypes.STRING, primaryKey: true },
    port: { type: DataTypes.INTEGER, primaryKey: true },
    blockchain: { type: DataTypes.STRING(70) },
    displayname: { type: DataTypes.STRING },
    mode: { type: DataTypes.STRING(70) },
    services: { type: DataTypes.TEXT },
    url: { type: DataTypes.TEXT },
    config: { type: DataTypes.TEXT },
    latest_ping_result: { type: DataTypes.TEXT },
    ping_success_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    // Other model options go here
});

module.exports = {
    Hand
};
