module.exports = function validateBalanceType(next) {
  const accountType = this.accountInfo.account_type;
  const allowedMerchantBalances = ['salafi_balance', 'mobile_banking_balance', 'bank_balance'];

  if (accountType === 'merchant') {
    if (!allowedMerchantBalances.includes(this.defaultBalanceType)) {
      return next(new Error('Invalid balance type for merchant'));
    }
  } else {
    if (this.defaultBalanceType !== 'salafi_balance') {
      return next(new Error('Only salafi_balance is allowed for personal or agent account'));
    }
  }

  next();
};
