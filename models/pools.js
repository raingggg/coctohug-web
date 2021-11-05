const { DataTypes } = require('sequelize');
const { getConnection } = require('../utils/sql-connection');

sequelize = getConnection();
const Pool = sequelize.define('Pool', {
    unique_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    hostname: { type: DataTypes.STRING },
    blockchain: { type: DataTypes.STRING(70) },
    launcher_id: { type: DataTypes.STRING },
    login_link: { type: DataTypes.TEXT },
    pool_state: { type: DataTypes.TEXT },
}, {
    // Other model options go here
});

module.exports = {
    Pool
};

