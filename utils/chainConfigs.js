const getExp = (blockchain) => {
  return `https://alltheblocks.net/${blockchain}/address/`
};

const getPeers = (blockchain) => {
  return `https://api.alltheblocks.net/${blockchain}/peer/recent?amount=100`;
};

const chainConfigs = {
  default: { exp: getExp('chia'), peers: getPeers('chia') },
  chia: { exp: getExp('chia'), peers: getPeers('chia') },

  cactus: { exp: getExp('cactus'), peers: getPeers('cactus') },
  covid: { exp: getExp('covid'), peers: getPeers('covid') },
  cryptodoge: { exp: getExp('cryptodoge'), peers: getPeers('cryptodoge') },
  ethgreen: { exp: getExp('ethgreen'), peers: getPeers('ethgreen') },
  flora: { exp: getExp('flora'), peers: getPeers('flora') },
  greendoge: { exp: getExp('greendoge'), peers: getPeers('greendoge') },
  lucky: { exp: getExp('lucky'), peers: getPeers('lucky') },
  pipscoin: { exp: getExp('pipscoin'), peers: getPeers('pipscoin') },
  shibgreen: { exp: getExp('shibgreen'), peers: getPeers('shibgreen') },
  silicoin: { exp: getExp('silicoin'), peers: getPeers('silicoin') },

  skynet: { exp: getExp('skynet'), peers: getPeers('skynet') },
  staicoin: { exp: getExp('stai'), peers: getPeers('stai') },
  stor: { exp: getExp('stor'), peers: getPeers('stor') },
  tranzact: { exp: getExp('tranzact'), peers: getPeers('tranzact') },
  venidium: { exp: getExp('venidium'), peers: getPeers('venidium') },
  btcgreen: { exp: getExp('btcgreen'), peers: getPeers('btcgreen') },
  hddcoin: { exp: getExp('hddcoin'), peers: getPeers('hddcoin') },
  maize: { exp: getExp('maize'), peers: getPeers('maize') },
  flax: { exp: getExp('flax'), peers: getPeers('flax') },
  aedge: { exp: getExp('aedge'), peers: getPeers('aedge') },

  apple: { exp: getExp('apple'), peers: getPeers('apple') },
  wheat: { exp: getExp('wheat'), peers: getPeers('wheat') },
  dogechia: { exp: getExp('dogechia'), peers: getPeers('dogechia') },
  tad: { exp: getExp('tad'), peers: getPeers('tad') },
  taco: { exp: getExp('taco'), peers: getPeers('taco') },
  socks: { exp: getExp('socks'), peers: getPeers('socks') },
  mogua: { exp: getExp('mogua'), peers: getPeers('mogua') },
  mint: { exp: getExp('mint'), peers: getPeers('mint') },
  salvia: { exp: getExp('salvia'), peers: getPeers('salvia') },
};

module.exports = chainConfigs;