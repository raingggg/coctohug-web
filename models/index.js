const { isWebControllerMode } = require('../utils/chiaConfig');
const isWebController = isWebControllerMode();
const emptyObject = {};

const { Blockchain } = isWebController ? require('./blockchains') : emptyObject;
const { Connection } = isWebController ? require('./connections') : emptyObject;
const { Farm } = isWebController ? require('./farms') : emptyObject;
const { Hand } = isWebController ? require('./hands') : emptyObject;
const { Key } = isWebController ? require('./keys') : emptyObject;
const { News } = isWebController ? require('./news') : emptyObject;
const { Plotnft } = isWebController ? require('./plotnfts') : emptyObject;
const { Plot } = isWebController ? require('./plots') : emptyObject;
const { Pool } = isWebController ? require('./pools') : emptyObject;
const { Wallet } = isWebController ? require('./wallets') : emptyObject;
const {
  ReviewPlotCount,
  ReviewPlotsSize,
  ReviewTotalChia,
  ReviewNetspaceSize,
  ReviewTimeToWin,
  ReviewPlotsTotalUsed,
  ReviewPlotsDiskUsed,
  ReviewPlottingDiskFree,
} = isWebController ? require('./blockchains') : emptyObject;

module.exports = {
  Blockchain,
  Connection,
  Farm,
  Hand,
  Key,
  News,
  Plotnft,
  Plot,
  Pool,
  Wallet,
  ReviewPlotCount,
  ReviewPlotsSize,
  ReviewTotalChia,
  ReviewNetspaceSize,
  ReviewTimeToWin,
  ReviewPlotsTotalUsed,
  ReviewPlotsDiskUsed,
  ReviewPlottingDiskFree,
};