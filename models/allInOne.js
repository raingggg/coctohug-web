const { DataTypes } = require('sequelize');

const { getConnection } = require('../utils/sqlConnection');

const sequelize = getConnection();
const AllInOne = sequelize.define('AllInOne', {
  hostname: { type: DataTypes.STRING, primaryKey: true },
  blockchain: { type: DataTypes.STRING(70), primaryKey: true },
  symbol: { type: DataTypes.STRING(70) },

  // chain status
  chain_last_updated_at: { type: DataTypes.DATE },
  chain_sync_to_time: { type: DataTypes.DATE },
  chain_height: { type: DataTypes.INTEGER, defaultValue: 0 },
  invalid_chain_status: { type: DataTypes.BOOLEAN },

  // farm summary
  farm_last_updated_at: { type: DataTypes.DATE },
  mode: { type: DataTypes.STRING(70) },
  status: { type: DataTypes.STRING(128) },
  plot_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  plots_size: { type: DataTypes.STRING },
  total_coins: { type: DataTypes.REAL, defaultValue: 0 }, // farmed coins
  netspace_size: { type: DataTypes.STRING(70) },
  expected_time_to_win: { type: DataTypes.STRING(128) },
  invalid_farm_status: { type: DataTypes.BOOLEAN },

  // connection count
  connection_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  invalid_connection_status: { type: DataTypes.BOOLEAN },

  // wallet
  wallet_status: { type: DataTypes.STRING(128) },
  wallet_height: { type: DataTypes.INTEGER, defaultValue: 0 },
  invalid_wallet_status: { type: DataTypes.BOOLEAN },

  // balances
  coin_price: { type: DataTypes.REAL, defaultValue: 0 },
  first_address: { type: DataTypes.STRING }, // if total_coins is 0, then join walletbalance first_address 
  first_balance: { type: DataTypes.REAL, defaultValue: 0 }, // first key balance
  wallet_balance: { type: DataTypes.REAL, defaultValue: 0 }, // wallet showed balance
  reward_address: { type: DataTypes.STRING }, // join with walletbalance to get balance
  reward_balance: { type: DataTypes.REAL, defaultValue: 0 },
  has_cold_address: { type: DataTypes.BOOLEAN },
  total_price: { type: DataTypes.REAL, defaultValue: 0 },

  // extend columns
  ext_num_1: { type: DataTypes.REAL, defaultValue: 0 },
  ext_num_2: { type: DataTypes.REAL, defaultValue: 0 },
  ext_num_3: { type: DataTypes.REAL, defaultValue: 0 },
  ext_str_1: { type: DataTypes.STRING },
  ext_str_2: { type: DataTypes.STRING },
  ext_str_3: { type: DataTypes.STRING },
  ext_str_4: { type: DataTypes.STRING },
  ext_str_5: { type: DataTypes.STRING },
}, {

});

const syncTable = async () => {
  await AllInOne.sync();
};
syncTable();

module.exports = {
  AllInOne
};