const fs = require('fs');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const dir = require('node-dir');
const {
  parseFarm,
  parseWallet,
  parseBlockchain,
  parseConnecitons,
  parseKeys,
  parsePlots
} = require('./chiaParser');
const { blockchainConfig: { binary, mainnet, config } } = require('./chiaConfig');
const { logger } = require('./logger');

const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const copyFile = promisify(fs.copyFile);
const writeFile = promisify(fs.writeFile);

const G_SIZE = 1024 * 1024 * 1024;

// const BLOCKCHAIN_BINARY = {
//     "chia": '/chia-blockchain/venv/bin/chia',
//     "flax": '/flax-blockchain/venv/bin/flax',
//     "flora": '/flora-blockchain/venv/bin/flora',
//     "sit": '/silicoin-blockchain/venv/bin/sit',
//     "nchain": '/ext9-blockchain/venv/bin/chia',
//     "hddcoin": '/hddcoin-blockchain/venv/bin/hddcoin',
// };

// const BLOCKCHAIN_MAINNET = {
//     "chia": "/root/.chia/mainnet",
//     "flax": "/root/.flax/mainnet",
//     "flora": "/root/.flora/mainnet",
//     "sit": "/root/.sit/mainnet",
//     "nchain": "/root/.chia/ext9",
//     "hddcoin": "/root/.hddcoin/mainnet",
// };
const TIMEOUT_1MINUTE = 60 * 1000;
const loadFarmSummary = async () => {
  let result = '';

  try {
    const cmdOutput = await exec(`${binary} farm summary`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' });
    result = cmdOutput.stdout.trim();
  } catch (e) {
    logger.error(e);
  }
  logger.debug(result);
  return parseFarm(result);
};

const loadWalletShowCallback = async (done) => {
  const spawn = require('child_process').spawn;
  const sp = spawn(binary, ['wallet', 'show'], { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' });

  sp.stdout.on('data', (data) => {
    logger.info(`stdout: ${data}`);
    if (data) {
      if (data.includes("Wallet height:")) {
        return done(null, parseWallet(data.toString()));
      } else if (data.includes("Choose wallet key:")) {
        sp.stdin.write("1\n");
      } else if (data.includes("No online backup file found:")) {
        sp.stdin.write("S\n");
      }
    }
  });

  sp.stderr.on('data', (data) => {
    logger.error(`stderr: ${data}`);
    return done(data);
  });

  sp.on('close', (code) => {
    logger.info(`child process exited with code ${code}`);
    return done(code);
  });
};
const loadWalletShow = promisify(loadWalletShowCallback);

const loadPlotnftShowCallback = async (done) => {
  const spawn = require('child_process').spawn;
  const sp = spawn(binary, ['plotnft', 'show'], { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' });

  sp.stdout.on('data', (data) => {
    logger.info(`stdout: ${data}`);
    if (data) {
      if (data.includes("Wallet height:")) {
        return done(null, parseWallet(data.toString()));
      } else if (data.includes("Choose wallet key:")) {
        sp.stdin.write("1\n");
      } else if (data.includes("No online backup file found:")) {
        sp.stdin.write("S\n");
      }
    }
  });

  sp.stderr.on('data', (data) => {
    logger.error(`stderr: ${data}`);
    return done(data);
  });

  sp.on('close', (code) => {
    logger.info(`child process exited with code ${code}`);
    return done(code);
  });
};
const loadPlotnftShow = promisify(loadPlotnftShowCallback);

const loadBlockchainShow = async () => {
  let result = '';

  try {
    const cmdOutput = await exec(`${binary} show --state`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' });
    result = cmdOutput.stdout.trim();
  } catch (e) {
    logger.error(e);
  }
  logger.debug(result);
  return parseBlockchain(result);
};

const loadConnectionsShow = async () => {
  let result = '';

  try {
    const cmdOutput = await exec(`${binary} show --connections`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' });
    result = cmdOutput.stdout.trim();
  } catch (e) {
    logger.error(e);
  }
  logger.debug(result);
  return parseConnecitons(result);
};

const loadKeysShow = async () => {
  let result = '';

  try {
    const cmdOutput = await exec(`${binary} keys show`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' });
    result = cmdOutput.stdout.trim();
  } catch (e) {
    logger.error(e);
  }
  logger.debug(result);
  return parseKeys(result);
};

const loadPlots = async () => {
  allEntries = [];

  const dirs = process.env['plots_dir'].split(':');
  for (let p = 0; p < dirs.length; p++) {
    const dirPath = dirs[p];
    try {
      const allFiles = await dir.promiseFiles(dirPath);
      const plotFiles = allFiles.filter(f => f.endsWith('.plot'));
      for (let i = 0; i < plotFiles.length; i++) {
        const bSize = await stat(plotFiles[i]);
        const gSize = bSize / G_SIZE;
        allEntries.push({
          file: plotFiles[i],
          size: gSize
        });
      }
    }
    catch (e) {
      logger.error(e);
    }
  }

  return allEntries;
};

const loadConfig = async () => {
  let content = '';
  try {
    content = await readFile(config);
  } catch (e) {
    logger.error(e);
  }
  return content;
};

const saveConfig = async (newConfig) => {
  try {
    await copyFile(config, `${copyFile}.${new Date()}`);
    await writeFile(config, newConfig);
  } catch (e) {
    logger.error(e);
  }
};

const addConnection = async () => {

};

const removeConnection = async () => {

};

const isPlotsCheckRunning = async () => {

};

const checkPlots = async () => {

};

const getPoolLoginLink = async () => {

};


// const at = async () => {
//   const tresult = await loadFarmSummary();
//   const tresult = await loadWalletShow();
//   const tresult = await loadPlotnftShow();
//   const tresult = await loadBlockchainShow();
//   const tresult = await loadConnectionsShow();
//   const tresult = await loadKeysShow();
//   console.log('tresult: ', tresult);
// };
// at();

module.exports = {
  loadFarmSummary,
  loadWalletShow,
  loadPlotnftShow,
  loadBlockchainShow,
  loadConnectionsShow,
  loadKeysShow,
  loadPlots,
  loadConfig,
  saveConfig,
  addConnection,
  removeConnection,
  isPlotsCheckRunning,
  checkPlots,
  getPoolLoginLink,
}