const REG_BALANCE = /-Total\sBalance:\s+((?:\d*\.\d+)|(?:\d+\.?))/g;

const getTotalBalance = (str) => {
  let sum = 0;

  while (null != (z = REG_BALANCE.exec(str))) {
    const ob = parseFloat(z[1]);
    if (ob > 0) sum += ob;
  }

  return sum;
}


module.exports = {
  getTotalBalance,
}