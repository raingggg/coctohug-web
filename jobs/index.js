const { updateWallet } = require('./wallets');
const { updateFarm } = require('./farms');
const { updateConnection } = require('./connections');
const { updateKey } = require('./keys');
const { updateBlockchain } = require('./blockchains');

module.exports = {
  updateWallet,
  updateFarm,
  updateConnection,
  updateKey,
  updateBlockchain,
};