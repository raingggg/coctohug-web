const { getConnection } = require('../utils/sqlConnection');
const sequelize = getConnection();
const queryInterface = sequelize.getQueryInterface();

const addColumn = async (tableName, columnName, columnProps) => {
  return queryInterface.describeTable(tableName).then(tableDefinition => {
    if (!tableDefinition[columnName]) {
      return queryInterface.addColumn(tableName, columnName, columnProps);
    } else {
      return Promise.resolve(true);
    }
  });
};

const removeColumn = async (tableName, columnName) => {
  return queryInterface.describeTable(tableName).then(tableDefinition => {
    if (tableDefinition[columnName]) {
      return queryInterface.removeColumn(tableName, columnName);
    } else {
      return Promise.resolve(true);
    }
  });
};

module.exports = {
  addColumn,
  removeColumn,
};