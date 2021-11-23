const REG_BALANCE = /-Total\sBalance:\s+((?:\d*\.\d+)|(?:\d+\.?))/g;
const REG_WALLET_ADDR = /First wallet address: (\w*)/;

const getTotalBalance = (str) => {
  let sum = 0;
  const reg = new RegExp(REG_BALANCE);
  while (null != (z = reg.exec(str))) {
    const ob = parseFloat(z[1]);
    if (ob > 0) sum += ob;
  }

  return sum;
}

const getWalletAddress = (str) => {
  const match = REG_WALLET_ADDR.exec(str);
  if (match) return match[1];
}

module.exports = {
  getTotalBalance,
  getWalletAddress,
}