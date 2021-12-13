const fs = require('fs');
const { promisify } = require('util');
const { stat, readFile, copyFile, writeFile } = require('fs/promises');
const exec = promisify(require('child_process').exec);
const axios = require('axios');

const dir = require('node-dir');
const {
  parseFarm,
  parseWallet,
  parseBlockchain,
  parseConnecitons,
  parseKeys,
  parsePlots
} = require('./chiaParser');
const {
  blockchainConfig: { binary, blockchain, config, mncPath, coldWalletName },
  getCoctohugWebVersion,
} = require('./chiaConfig');
const chainConfigs = require('./chainConfigs');
const { logger } = require('./logger');


const G_SIZE = 1024 * 1024 * 1024;
const TIMEOUT_1MINUTE = 60 * 1000;
const TIMEOUT_2MINUTE = 2 * 60 * 1000;

const loadFarmSummary = async () => {
  let result = '';

  try {
    const cmdOutput = await exec(`${binary} farm summary`, { timeout: TIMEOUT_2MINUTE, killSignal: 'SIGKILL' });
    result = cmdOutput.stdout.trim();
  } catch (e) {
    logger.error(e);
  }
  logger.debug(result);
  return parseFarm(result);
};

const loadWalletShowCallback = async (done) => {
  const spawn = require('child_process').spawn;
  const sp = spawn(binary, ['wallet', 'show'], { timeout: TIMEOUT_2MINUTE, killSignal: 'SIGKILL' });

  sp.stdout.on('data', (data) => {
    logger.info(`stdout: ${data}`);
    if (data) {
      if (data.includes("Wallet height:")) {
        return done(null, parseWallet(data.toString()));
      } else if (data.includes("Choose wallet key")) {
        sp.stdin.write("1\n");
      } else if (data.includes("No online backup file found")) {
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
  const sp = spawn(binary, ['plotnft', 'show'], { timeout: TIMEOUT_2MINUTE, killSignal: 'SIGKILL' });

  sp.stdout.on('data', (data) => {
    logger.info(`stdout: ${data}`);
    if (data) {
      if (data.includes("Wallet height:")) {
        return done(null, parseWallet(data.toString()));
      } else if (data.includes("Choose wallet key")) {
        sp.stdin.write("1\n");
      } else if (data.includes("No online backup file found")) {
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
    const cmdOutput = await exec(`${binary} show --connections`, { timeout: TIMEOUT_2MINUTE, killSignal: 'SIGKILL' });
    result = cmdOutput.stdout.trim();
    checkPeerConnections(result);
  } catch (e) {
    logger.error(e);
  }
  logger.debug(result);

  return result;
};

const checkPeerConnections = async (result) => {
  try {
    // 2 are local connection, so 5 means checking at least 3 peers
    const cns = parseConnecitons(result);
    if (cns.length < 5 && chainConfigs[blockchain]) {
      const apiRes = await axios.get(chainConfigs[blockchain].peers, { timeout: TIMEOUT_1MINUTE }).catch(function (error) { logger.error(error); });
      const peers = apiRes && apiRes.data;
      const peersCount = peers && peers.length;
      if (peersCount > 0) {
        let peersConnections = [];
        if (peersCount > 30) {
          for (let i = 0; i < 30; i++) {
            const p = peers[Math.floor(Math.random() * peersCount)];
            peersConnections.push(`${p.host}:${p.port}`);
          }
        } else {
          peersConnections = peers.map(p => `${p.host}:${p.port}`);
        }

        for (let i = 0; i < peersConnections.length; i++) {
          await addConnection(peersConnections[i]);
        }
      }
    }
  } catch (e) {
    logger.error(e);
  }
};

const loadKeysShow = async () => {
  let result = '';

  try {
    const cmdOutput = await exec(`${binary} keys show`, { timeout: TIMEOUT_2MINUTE, killSignal: 'SIGKILL' });
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
    content = await readFile(config, 'utf8');
  } catch (e) {
    logger.error(e);
  }
  return content;
};

const saveConfig = async (newConfig) => {
  let result = false;

  try {
    await copyFile(config, `${config}.${new Date().toISOString().replace(/[:\.]/g, '-')}`);
    await writeFile(config, newConfig);
    result = true;
  } catch (e) {
    logger.error(e);
  }

  return result;
};

const saveColdWallet = async (coldWalletAddress) => {
  let result = false;

  try {
    const content = await loadConfig();
    const reg = new RegExp('(' + coldWalletName + ':\\s*)(\\w+)', 'g');
    const dest = `$1${coldWalletAddress}`;
    const newConfig = content.replace(reg, dest);
    result = await saveConfig(newConfig);
  } catch (e) {
    logger.error(e);
  }

  return result;
};

const saveMNC = async (mnc) => {
  if (!mnc) return;

  try {
    await writeFile(mncPath, mnc.trim());
  } catch (e) {
    logger.error(e);
  }
};


const addConnection = async (connection) => {
  let result = '';

  try {
    const cmdOutput = await exec(`${binary} show --add-connection ${connection}`, { timeout: TIMEOUT_2MINUTE, killSignal: 'SIGKILL' });
    result = cmdOutput.stdout.trim();
  } catch (e) {
    logger.error(e);
  }
  logger.debug(result);

  return result;
};

const removeConnection = async (nodeIds) => {
  try {
    for (let i = 0; i < nodeIds.length; i++) {
      try {
        const nodeId = nodeIds[i];
        await exec(`${binary} show --remove-connection ${nodeId}`, { timeout: TIMEOUT_2MINUTE, killSignal: 'SIGKILL' });
      } catch (ex) {
        logger.error(ex);
      }
    }
  } catch (e) {
    logger.error(e);
  }
};

const isPlotsCheckRunning = async () => {

};

const checkPlots = async () => {

};

const getPoolLoginLink = async () => {

};

const loadAllVersions = async () => {
  let result = '';

  try {
    const cmdOutput = await exec(`${binary} version`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' });
    result = `${blockchain}: ${cmdOutput.stdout.trim()}`;
  } catch (e) {
    logger.error(e);
  }
  logger.debug(result);

  const coctohugWeb = getCoctohugWebVersion();
  result += `\ncoctohugWeb: ${coctohugWeb}`;

  return result;
}

const restartBlockchain = async () => {
  let result = '';

  try {
    const cmdOutput = await exec(`${binary} start farmer -r`, { timeout: TIMEOUT_2MINUTE, killSignal: 'SIGKILL' });
    result = `${blockchain}: ${cmdOutput.stdout.trim()}`;
  } catch (e) {
    logger.error(e);
  }

  logger.debug(result);

  return result;
};

const addKeyBlockchain = async () => {
  let result = '';

  try {
    const cmdOutput = await exec(`${binary} keys add -f ${mncPath}`, { timeout: TIMEOUT_2MINUTE, killSignal: 'SIGKILL' });
    result = `${addKeyBlockchain}: ${cmdOutput.stdout.trim()}`;
  } catch (e) {
    logger.error(e);
  }

  logger.debug(result);

  return result;
};

const generateKeyBlockchain = async () => {
  try {
    await exec(`${binary} keys generate`, { timeout: TIMEOUT_2MINUTE, killSignal: 'SIGKILL' });
    const cmdOutput = await exec(`${binary} keys show --show-mnemonic-seed | tail -n 1`, { timeout: TIMEOUT_2MINUTE, killSignal: 'SIGKILL' });
    await saveMNC(cmdOutput.stdout.trim());
  } catch (e) {
    logger.error(e);
  }
};

const getColdWalletAddress = async () => {
  let result = '';

  try {
    const content = await loadConfig();
    const reg = new RegExp('(' + coldWalletName + ':\\s*)(\\w+)');
    const match = reg.exec(content);
    if (match) result = match[2];
  } catch (e) {
    logger.error(e);
  }

  return result;
};

const transferCoin = async (toAddress, amount) => {
  let result = '';

  try {
    const cmdOutput = await exec(`${binary} wallet send -t ${toAddress} -a ${amount}`, { timeout: TIMEOUT_2MINUTE, killSignal: 'SIGKILL' });
    result = cmdOutput.stdout.trim();
  } catch (e) {
    logger.error(e);
  }
  logger.debug(result);

  return result;
};

// const at = async () => {
//   const tresult = await loadFarmSummary();
//   const tresult = await loadWalletShow();
//   const tresult = await loadPlotnftShow();
//   const tresult = await loadBlockchainShow();
// const tresult = await loadConnectionsShow();
//   const tresult = await loadKeysShow();
//   const tresult = await loadAllVersions();
//   const tresult = await restartBlockchain();
// await saveMNC('hoholala');
// const tresult = await addKeyBlockchain();
// await generateKeyBlockchain();
// const tresult = await saveColdWallet('cac19sgmf7ulreve95rzmyqyyc5rduqx0aw8kt53thw3dt5zs8v830zqcm4vk8');
// const tresult = await getColdWalletAddress();
//   const tresult = await transferCoin('cac19sgmf7ulreve95rzmyqyyc5rduqx0aw8kt53thw3dt5zs8v830zqcm4vk8');
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
  saveMNC,
  addConnection,
  removeConnection,
  isPlotsCheckRunning,
  checkPlots,
  getPoolLoginLink,
  loadAllVersions,
  restartBlockchain,
  addKeyBlockchain,
  generateKeyBlockchain,
  saveColdWallet,
  getColdWalletAddress,
  transferCoin,
}