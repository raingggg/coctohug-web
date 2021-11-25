const blockchainsWorker = require('./blockchains');
const certificatesWorker = require('./certificates');
const connectionsWorker = require('./connections');
const walletsWorker = require('./wallets');

module.exports = {
  blockchainsWorker,
  certificatesWorker,
  connectionsWorker,
  walletsWorker,
};