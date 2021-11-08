const { DataTypes } = require('sequelize');
const { getConnection } = require('../utils/sqlConnection');

sequelize = getConnection();
const Key = sequelize.define('Key', {
    hostname: { type: DataTypes.STRING, primaryKey: true },
    blockchain: { type: DataTypes.STRING(70), primaryKey: true },
    details: { type: DataTypes.TEXT },
}, {
    // Other model options go here
});

module.exports = {
    Key
};
