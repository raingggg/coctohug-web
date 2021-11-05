const { DataTypes } = require('sequelize');
const { getConnection } = require('../utils/sql-connection');

sequelize = getConnection();
const Connections = sequelize.define('Connections', {
    hostname: { type: DataTypes.STRING, primaryKey: true },
    blockchain: { type: DataTypes.STRING(70), primaryKey: true },
    details: { type: DataTypes.TEXT },
}, {
    // Other model options go here
});

module.exports = {
    Connections
};