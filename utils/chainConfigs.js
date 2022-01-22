// coctohug maps to chainname on API
const chainNameMap = {
  default: 'chia',

  cactus: 'cactus',
  covid: 'covid',
  cryptodoge: 'cryptodoge',
  ethgreen: 'ethgreen',
  flora: 'flora',
  greendoge: 'greendoge',
  lucky: 'lucky',
  pipscoin: 'pipscoin',
  shibgreen: 'shibgreen',
  silicoin: 'silicoin',

  skynet: 'skynet',
  stor: 'stor',
  staicoin: 'stai',
  tranzact: 'tranzact',
  venidium: 'venidium',
  btcgreen: 'btcgreen',
  hddcoin: 'hddcoin',
  maize: 'maize',
  flax: 'flax',
  aedge: 'aedge',

  apple: 'apple',
  wheat: 'wheat',
  dogechia: 'dogechia',
  tad: 'tad',
  taco: 'taco',
  socks: 'socks',
  mogua: 'mogua',
  mint: 'mint',
  salvia: 'salvia',
  chia: 'chia',

  nchain: 'nchain',
  chives: 'chives',
  avocado: 'avocado',
  kale: 'kale',
  cannabis: 'cannabis',
  melati: 'melati',
  sector: 'sector',
  scam: 'scam',
  fork: 'fork',
  seno: 'seno',

  rose: 'rose',
  goji: 'goji',
  spare: 'spare',
  chaingreen: 'chaingreen',
  rolls: 'rolls',
  melon: 'melon',
  goldcoin: 'goldcoin',
  kujenga: 'kujenga',
  lotus: 'lotus',
  thyme: 'thyme',

  kiwi: 'kiwi',
  littlelambocoin: 'littlelambocoin',
};

const chainSymbolMap = {
  default: 'chia',

  cactus: 'CAC',
  covid: 'COV',
  cryptodoge: 'XCD',
  ethgreen: 'XETH',
  flora: 'XFL',
  greendoge: 'GDOG',
  lucky: 'SIX',
  pipscoin: 'PIPS',
  shibgreen: 'XSHIB',
  silicoin: 'SIT',

  skynet: 'XNT',
  stor: 'STOR',
  staicoin: 'STAI',
  tranzact: 'TRZ',
  venidium: 'XVM',
  btcgreen: 'XBTC',
  hddcoin: 'HDD',
  maize: 'XMZ',
  flax: 'XFX',
  aedge: 'AEC',

  apple: 'APPLE',
  wheat: 'WHEAT',
  dogechia: 'XDG',
  tad: 'TAD',
  taco: 'XTX',
  socks: 'SOCK',
  mogua: 'MGA',
  mint: 'XKM',
  salvia: 'XSLV',
  chia: 'XCH',

  nchain: 'NCH',
  chives: 'XCC',
  avocado: 'AVO',
  kale: 'XKA',
  cannabis: 'CANS',
  melati: 'XMX',
  sector: 'XSC',
  scam: 'SCM',
  fork: 'XFK',
  seno: 'XSE',

  rose: 'XCR',
  goji: 'XGJ',
  spare: 'SPARE',
  chaingreen: 'CGN',
  rolls: 'ROLLS',
  melon: 'MELON',
  goldcoin: 'OZT',
  kujenga: 'XKJ',
  lotus: 'LCH',
  thyme: 'XTH',

  kiwi: 'XKW',
  littlelambocoin: 'LLC',
};

const getExp = (blockchain) => {
  return `https://alltheblocks.net/${blockchain}/address/`
};

const getPeers = (blockchain) => {
  return `https://api.alltheblocks.net/${blockchain}/peer/recent?amount=100`;
};

const getCoinRecordsUrl = (blockchain, address, pageNumber, pageSize) => {
  const apiName = chainNameMap[blockchain];
  return `https://api.alltheblocks.net/${apiName}/coin/address/${address}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
};

const getBalanceUrl = (blockchain, address) => {
  const apiName = chainNameMap[blockchain];
  return `https://api.alltheblocks.net/${apiName}/address/name/${address}`;
};

const getPriceUrl = () => {
  return 'https://api.alltheblocks.net/atb/blockchain/settings-and-stats';
};

const getMojoDivider = (blockchain) => {
  if (['shibgreen'].includes(blockchain)) return 1000;
  else if (['cryptodoge'].includes(blockchain)) return 1000000;
  else if (['ethgreen', 'staicoin', 'melon'].includes(blockchain)) return 1000000000;

  return 1000000000000;
};

const getMojoMultiplier = (blockchain) => {
  if (['cryptodoge', 'shibgreen'].includes(blockchain)) return 1000000;

  return 1;
};



const chainConfigs = {};
Object.keys(chainNameMap).forEach(cname => {
  const apiName = chainNameMap[cname];
  chainConfigs[cname] = {
    exp: getExp(apiName),
    peers: getPeers(apiName),
    mojoDivider: getMojoDivider(cname),
    mojoMultiplier: getMojoMultiplier(cname),
    symbol: chainSymbolMap[cname],
  };
});

module.exports = {
  chainNameMap,
  chainConfigs,
  getCoinRecordsUrl,
  getBalanceUrl,
  getPriceUrl,
};