const parseFarm = (cmdStr) => {
  const result = {};

  const lines = cmdStr.split('\n');
  lines.forEach(line => {
    if (line.includes('Plot count')) {
      result.plot_count = line.trim().split(':')[1].trim();
    } else if (line.includes('Total size of plots')) {
      result.plots_size = line.trim().split(':')[1].trim();
    } else if (line.includes('status')) {
      result.status = line.trim().split(':')[1].trim();
    } else if (/Total.*farmed.*/.test(line)) {
      result.total_coins = line.trim().split(':')[1].trim();
    } else if (line.includes('Estimated network space')) {
      result.netspace_size = line.trim().split(':')[1].trim();
    } else if (line.includes('Expected time to win')) {
      result.expected_time_to_win = line.trim().split(':')[1].trim();
    }
  });

  return result;
};

const parseWallet = (cmdStr) => {
  return cmdStr;
};

const parseBlockchain = (cmdStr) => {
  return cmdStr;
};

const parseConnecitons = (cmdStr) => {
  return cmdStr;
};

const parseKeys = (cmdStr) => {
  return cmdStr;
};

const parsePlots = (cmdStr) => {
  const result = {};

  const lines = cmdStr.split('\n');
  lines.forEach(line => {
    // logger.info('--', line);
  });

  return result;
};

module.exports = {
  parseFarm,
  parseWallet,
  parseBlockchain,
  parseConnecitons,
  parseKeys,
  parsePlots,
};