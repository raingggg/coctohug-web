const filename = process.env.BLOCKCHAIN_CONFIG || '../chia.json';
const blockchainConfig = require(filename);

module.exports = {
    blockchainConfig
};