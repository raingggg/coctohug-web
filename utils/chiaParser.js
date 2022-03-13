const parseFarm = (cmdStr) => {
  const result = { details: cmdStr };

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
  const cns = [];

  try {
    const lines = cmdStr.replace(/(\s*)(-SB Height:)(.*)/g, " $3").split('\n');
    lines.forEach(line => {
      const tLine = line.trim();
      if (tLine && !tLine.startsWith('Connections:') && !tLine.startsWith('Type')) {
        const vals = tLine.split(/\s+/);
        if (vals.length > 7) {
          cns.push({
            'type': vals[0],
            'ip': vals[1],
            'ports': vals[2],
            'nodeid': vals[3].replace('...', ''),
            'last_connect': vals[4] + ' ' + vals[5] + ' ' + vals[6],
            'mib_up': vals[7].split('|')[0],
            'mib_down': vals[7].split('|')[1],
            'height': vals[8] || '',
          });
        }
      }

    });
  } catch (e) {
    console.error(e);
  }

  return cns.sort((a, b) => a.height - b.height);
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