const {
  Blockchain,
  Connection,
  Farm,
  Hand,
  Key,
  Wallet,
  WalletBalance,
  AllInOne,
} = require('../models');
const {
  TIMEOUT_30MINUTE,
  toNumber,
} = require('../utils/jsUtil');
const { logger } = require('../utils/logger');
const {
  getBlockchainInfo,
  getWalletInfo,
  getWalletAddress,
} = require('../utils/blockUtil');
const { chainConfigs } = require('../utils/chainConfigs');
const { parseConnecitons } = require('../utils/chiaParser');

const updateAllInOne = async () => {
  try {
    const chains = await Blockchain.findAll({
      order: [
        ['blockchain', 'ASC'],
      ]
    });
    const farms = await Farm.findAll({
      order: [
        ['blockchain', 'ASC'],
      ]
    });
    const connections = await Connection.findAll({
      order: [
        ['blockchain', 'ASC'],
      ]
    });
    const wallets = await Wallet.findAll({
      order: [
        ['blockchain', 'ASC'],
      ]
    });
    const keys = await Key.findAll({
      order: [
        ['blockchain', 'ASC'],
      ]
    });
    const balances = await WalletBalance.findAll({
      order: [
        ['price', 'DESC'],
      ]
    });

    const now = new Date().getTime();
    for (let i = 0; i < chains.length; i++) {
      try {
        const payload = {};

        // blockchain
        const { hostname, blockchain } = chains[i];
        const chainConfig = chainConfigs[blockchain];
        const { chain_sync_to_time, chain_height } = getBlockchainInfo(chains[i].details);
        Object.assign(payload, {
          hostname,
          blockchain,
          symbol: chainConfig && chainConfig.symbol,
          chain_last_updated_at: chains[i].updatedAt,
          chain_sync_to_time,
          chain_height
        });

        // farm summary
        let oneRecord = farms.find(rc => rc.hostname === hostname && rc.blockchain === blockchain);
        if (oneRecord) {
          Object.assign(payload, {
            farm_last_updated_at: oneRecord.updatedAt,
            mode: oneRecord.mode,
            status: oneRecord.status,
            plot_count: oneRecord.plot_count,
            plots_size: oneRecord.plots_size,
            total_coins: oneRecord.total_coins,
            netspace_size: oneRecord.netspace_size,
            expected_time_to_win: oneRecord.expected_time_to_win,
          });

          const lastReview = new Date(oneRecord.updatedAt).getTime();
          if (now - lastReview > TIMEOUT_30MINUTE) {
            Object.assign(payload, { status: 'Sync Error' });
          }
        }

        // connection count
        oneRecord = connections.find(rc => rc.hostname === hostname && rc.blockchain === blockchain);
        if (oneRecord) {
          const connection_count = parseConnecitons(oneRecord.details).length - 2; // 2 local connections
          Object.assign(payload, {
            connection_count,
          });
        }

        // wallet
        oneRecord = wallets.find(rc => rc.hostname === hostname && rc.blockchain === blockchain);
        if (oneRecord) {
          const { wallet_status, wallet_height, wallet_balance } = getWalletInfo(oneRecord.details);
          Object.assign(payload, {
            wallet_status,
            wallet_height,
            wallet_balance,
            reward_address: oneRecord.coldWallet,
          });
        }

        // key
        oneRecord = keys.find(rc => rc.hostname === hostname && rc.blockchain === blockchain);
        if (oneRecord) {
          Object.assign(payload, {
            first_address: getWalletAddress(oneRecord.details),
          });
        }

        Object.assign(payload, {
          has_cold_address: payload.first_address !== payload.reward_address,
        });

        // balances
        const bls = balances.filter(rc => rc.blockchain === blockchain);
        if (bls.length > 0) {
          Object.assign(payload, {
            price: toNumber(bls[0].price),
          });

          oneRecord = bls.find(rc => rc.address === payload.reward_address);
          Object.assign(payload, {
            reward_balance: toNumber(oneRecord && oneRecord.balance),
          });

          oneRecord = bls.find(rc => rc.address === payload.first_address);
          Object.assign(payload, {
            first_balance: toNumber(oneRecord && oneRecord.balance),
          });

          // use first_balance as wallet_balance in case of it is invalid
          if (!payload.wallet_balance && payload.first_balance >= 0) {
            Object.assign(payload, {
              wallet_balance: payload.first_balance,
            });
          }

          const totalBalance = payload.has_cold_address ? payload.wallet_balance + payload.reward_balance : payload.wallet_balance;
          Object.assign(payload, {
            total_price: totalBalance * payload.price,
          });
        }

        console.log(payload);
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