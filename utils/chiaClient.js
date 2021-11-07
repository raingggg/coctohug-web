const os = require('os');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const stat = util.promisify(fs.stat);
const nexpect = require('nexpect');
var dir = require('node-dir');
const {
    parseFarm,
    parseWallet,
    parseBlockchain,
    parseConnecitons,
    parseKeys,
    parsePlots
} = require('./chiaParser');
let { blockchainConfig: { binary, mainnet } } = require('./chiaConfig');
binary = path.resolve(os.homedir(), binary);
mainnet = path.resolve(os.homedir(), mainnet);

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
const TIMEOUT_2MINUTE = 2 * TIMEOUT_1MINUTE;
const loadFarmSummary = async () => {
    let result = '';

    try {
        const cmdOutput = await exec(`${binary} farm summary`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' });
        result = cmdOutput.stdout.trim();
    } catch (e) {
        console.log(e);
    }
    // console.log(result);
    return parseFarm(result);
};

const loadWalletShow = async () => {
    try {
        nexpect.spawn(`${binary} wallet show`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' })
            .expect("Wallet height:")
            .run(function (err, re) {
                if (err) {
                    console.log("No wallet heigt: ", err)
                    nexpect.spawn(`${binary} wallet show`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' })
                        .wait("Choose wallet key:")
                        .sendline("1")
                        .run(function (err, re) {
                            if (err) {
                                console.log("multiple wallets: ", err);
                                nexpect.spawn(`${binary} wallet show`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' })
                                    .wait("Choose wallet key:")
                                    .sendline("1")
                                    .wait("No online backup file found")
                                    .sendline("S")
                                    .run(function (err, re) {
                                        if (err) {
                                            console.log("multiple wallets: ", err)
                                        } else {
                                            console.log("actual result:", re);
                                            return parseWallet(re);
                                        }
                                    });
                            } else {
                                console.log("actual result for the first wallet:", re);
                                return parseWallet(re);
                            }
                        });
                } else {
                    console.log("actual result for one wallet:", re);
                    return parseWallet(re);
                }
            });
    } catch (e) {
        console.log(e);
    }
};

const loadPlotNFTShow = async () => {
    try {
        nexpect.spawn(`${binary} plotnft show`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' })
            .expect("Wallet height:")
            .run(function (err, re) {
                if (err) {
                    console.log("No wallet heigt: ", err)
                    nexpect.spawn(`${binary} plotnft show`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' })
                        .wait("Choose wallet key:")
                        .sendline("1")
                        .run(function (err, re) {
                            if (err) {
                                console.log("multiple wallets: ", err);
                                nexpect.spawn(`${binary} plotnft show`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' })
                                    .wait("Choose wallet key:")
                                    .sendline("1")
                                    .wait("No online backup file found")
                                    .sendline("S")
                                    .run(function (err, re) {
                                        if (err) {
                                            console.log("multiple wallets: ", err)
                                        } else {
                                            console.log("actual result:", re);
                                            return parseWallet(re);
                                        }
                                    });
                            } else {
                                console.log("actual result for the first wallet:", re);
                                return parseWallet(re);
                            }
                        });
                } else {
                    console.log("actual result for one wallet:", re);
                    return parseWallet(re);
                }
            });
    } catch (e) {
        console.log(e);
    }
};

const loadBlockchainShow = async () => {
    let result = '';

    try {
        const cmdOutput = await exec(`${binary} show --state`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' });
        result = cmdOutput.stdout.trim();
    } catch (e) {
        console.log(e);
    }
    console.log(result);
    return parseBlockchain(result);
};

const loadConnectionsShow = async () => {
    let result = '';

    try {
        const cmdOutput = await exec(`${binary} show --connections`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' });
        result = cmdOutput.stdout.trim();
    } catch (e) {
        console.log(e);
    }
    console.log(result);
    return parseConnecitons(result);
};

const loadKeysShow = async () => {
    let result = '';

    try {
        const cmdOutput = await exec(`${binary} keys show`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' });
        result = cmdOutput.stdout.trim();
    } catch (e) {
        console.log(e);
    }
    console.log(result);
    return parseKeys(result);
};

const loadPlots = async () => {
    allEntries = [];

    process.env['plots_dir'].split(':').forEach((dirPath) => {
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
            console.log(e);
        }
    });

    return allEntries;
};

// loadFarmSummary();
// loadWalletShow();
// loadPlotNFTShow();
// loadBlockchainShow();
// loadConnectionsShow();
// loadKeysShow();

module.exports = {
    loadFarmSummary,
    loadWalletShow,
    loadPlotNFTShow,
    loadBlockchainShow,
    loadConnectionsShow,
    loadKeysShow,
    loadPlots,
}