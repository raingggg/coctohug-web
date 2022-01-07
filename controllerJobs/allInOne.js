const { QueryTypes } = require('sequelize');
const { getConnection } = require('../utils/sqlConnection');
const {
  WalletBalance,
  AllInOne,
} = require('../models');
const {
  TIMEOUT_10MINUTE,
  TIMEOUT_30MINUTE,
  TIMEOUT_90MINUTE,
  toNumber,
} = require('../utils/jsUtil');
const { logger } = require('../utils/logger');
const {
  getBlockchainInfo,
  getWalletInfo,
  getWalletAddress,
} = require('../utils/blockUtil');
const { chainConfigs } = require('../utils/chainConfigs');
const {
  isFarmerMode
} = require('../utils/chiaConfig');
const { parseConnecitons } = require('../utils/chiaParser');

const isFarmer = isFarmerMode();

const sequelize = getConnection();
const updateAllInOne = async () => {
  try {
    const payloads = await sequelize.query(`
    SELECT 
      b.hostname AS hostname,
      b.blockchain AS blockchain,
      b.updatedAt AS chain_last_updated_at,
      b.details AS blockchainDetail,
      w.details AS walletDetail,
      c.details AS connectionDetail,
      k.details AS keyDetail,
      f.updatedAt AS farm_last_updated_at,
      f.mode AS mode,
      f.status AS status,
      f.plot_count AS plot_count,
      f.plots_size AS plots_size,
      f.total_coins AS total_coins,
      f.netspace_size AS netspace_size,
      f.expected_time_to_win AS expected_time_to_win,
      wb.address AS reward_address,
      wb.balance AS reward_balance
    FROM Blockchains b
    LEFT JOIN Farms f on b.blockchain = f.blockchain and b.hostname = f.hostname
    LEFT JOIN Connections c on b.blockchain = c.blockchain and b.hostname = c.hostname
    LEFT JOIN Wallets w on b.blockchain = w.blockchain and b.hostname = w.hostname
    LEFT JOIN keys k on b.blockchain = k.blockchain and b.hostname = k.hostname
    LEFT JOIN WalletBalances wb on w.blockchain = wb.blockchain and w.coldWallet = wb.address
    `, { type: QueryTypes.SELECT });

    const balances = await WalletBalance.findAll({
      order: [
        ['price', 'DESC'],
      ]
    });

    const now = new Date().getTime();
    for (let i = 0; i < payloads.length; i++) {
      try {
        const payload = payloads[i];
        const { blockchain, blockchainDetail, walletDetail, keyDetail, connectionDetail, farm_last_updated_at } = payload;

        // blockchain
        const chainConfig = chainConfigs[blockchain];
        const { chain_sync_to_time, chain_height } = getBlockchainInfo(blockchainDetail);
        Object.assign(payload, { symbol: chainConfig && chainConfig.symbol, chain_sync_to_time, chain_height });

        // farm summary
        const lastReview = new Date(farm_last_updated_at).getTime();
        if (now - lastReview > TIMEOUT_90MINUTE) {
          Object.assign(payload, { status: 'Sync Error' });
        }

        // connection count
        let connection_count = parseConnecitons(connectionDetail).length - 2; // 2 local connections
        if (connection_count < 0) connection_count = 0;
        Object.assign(payload, { connection_count });

        // wallet
        const { wallet_status, wallet_height, wallet_balance } = getWalletInfo(walletDetail);
        Object.assign(payload, { wallet_status, wallet_height, wallet_balance });

        // key
        Object.assign(payload, { first_address: getWalletAddress(keyDetail) });

        // has_cold_address
        Object.assign(payload, { has_cold_address: payload.first_address !== payload.reward_address });

        // balances
        const bls = balances.filter(rc => rc.blockchain === blockchain);
        if (bls.length > 0) {
          Object.assign(payload, {
            coin_price: parseFloat(toNumber(bls[0].price).toFixed(8)),
          });

          let oneRecord = bls.find(rc => rc.address === payload.reward_address);
          Object.assign(payload, { reward_balance: parseFloat(toNumber(oneRecord && oneRecord.balance).toFixed(8)) });

          oneRecord = bls.find(rc => rc.address === payload.first_address);
          Object.assign(payload, { first_balance: parseFloat(toNumber(oneRecord && oneRecord.balance).toFixed(8)) });

          // use first_balance as wallet_balance in case of it is invalid
          if (isFarmer && !payload.wallet_balance && payload.first_balance >= 0) {
            Object.assign(payload, { wallet_balance: payload.first_balance });
          }

          const totalBalance = payload.has_cold_address ? payload.wallet_balance + payload.reward_balance : payload.wallet_balance;
          Object.assign(payload, { total_price: parseFloat((totalBalance * payload.coin_price).toFixed(8)) });
        }

        // format amount
        Object.assign(payload, { wallet_balance: parseFloat(toNumber(payload.wallet_balance).toFixed(8)) });
        Object.assign(payload, { total_coins: parseFloat(toNumber(payload.total_coins).toFixed(8)) });

        // status update
        Object.assign(payload, { invalid_farm_status: payload.status !== 'Farming' });
        Object.assign(payload, { invalid_chain_status: (now - new Date(chain_sync_to_time).getTime()) > TIMEOUT_90MINUTE });
        Object.assign(payload, { invalid_connection_status: payload.connection_count <= 0 });
        Object.assign(payload, { invalid_wallet_status: payload.wallet_status !== 'Synced' });

        // console.log(payload);
        await AllInOne.upsert(payload);
      } catch (ex) {
        logger.error('updateAllInOne-job-one', ex);
      }
    }
  } catch (e) {
    logger.error('updateAllInOne-job', e);
  }
};

// updateAllInOne();

module.exports = {
  updateAllInOne
};