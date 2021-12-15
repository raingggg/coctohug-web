const { DataTypes } = require('sequelize');

const { getConnection } = require('../utils/sqlConnection');

const sequelize = getConnection();
const Pool = sequelize.define('Pool', {
    unique_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    hostname: { type: DataTypes.STRING },
    blockchain: { type: DataTypes.STRING(70) },
    launcher_id: { type: DataTypes.STRING },
    login_link: { type: DataTypes.TEXT },
    pool_state: { type: DataTypes.TEXT },
}, {
    
});

module.exports = {
    Pool
};

