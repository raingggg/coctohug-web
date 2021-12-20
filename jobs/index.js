const { isWebControllerMode } = require('../utils/chiaConfig');
const isWebController = isWebControllerMode();

const emptyObject = {};
const { updateWallet } = isWebController ? emptyObject : require('./wallets');
const { updateFarm } = isWebController ? emptyObject : require('./farms');
const { updateConnection } = isWebController ? emptyObject : require('./connections');
const { updateKey } = isWebController ? emptyObject : require('./keys');
const { updateBlockchain } = isWebController ? emptyObject : require('./blockchains');
const { updateHand } = isWebController ? emptyObject : require('./hands');
const { emptyWorkerLogs } = isWebController ? emptyObject : require('./logs');

module.exports = {
  updateWallet,
  updateFarm,
  updateConnection,
  updateKey,
  updateBlockchain,
  updateHand,
  emptyWorkerLogs,
};