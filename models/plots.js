const { DataTypes } = require('sequelize');

const { getConnection } = require('../utils/sqlConnection');

sequelize = getConnection();
const Plot = sequelize.define('Plot', {
    hostname: { type: DataTypes.STRING, primaryKey: true },
    displayname: { type: DataTypes.STRING },
    blockchain: { type: DataTypes.STRING(70) },
    file: { type: DataTypes.STRING },
    size: { type: DataTypes.INTEGER },
}, {
    
});

module.exports = {
    Plot
};
