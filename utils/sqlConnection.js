const { Sequelize } = require('sequelize');
const { getSqlitePath } = require('./chiaConfig');

let _sequelize = null;

const sqlitePath = getSqlitePath();
function getConnection() {
  if (_sequelize) {
    return _sequelize;
  } else {
    const _sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: sqlitePath,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });

    return _sequelize;
  }
}

module.exports = {
  getConnection
};