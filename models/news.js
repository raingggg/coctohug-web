const { DataTypes } = require('sequelize');
const { getConnection } = require('../utils/sql-connection');

sequelize = getConnection();
const News = sequelize.define('News', {
    unique_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    hostname: { type: DataTypes.STRING },
    blockchain: { type: DataTypes.STRING(70) },
    priority: { type: DataTypes.STRING(70) },
    service: { type: DataTypes.STRING(70) },
    message: { type: DataTypes.TEXT },
}, {
    // Other model options go here
});

module.exports = {
    News
};
