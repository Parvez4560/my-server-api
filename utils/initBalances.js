// accountType অনুযায়ী initial balances setup
function initBalances(accountType) {
  const balances = [];

  if (accountType === 'Personal') {
    balances.push({ type: 'main', amount: 0 });
    balances.push({ type: 'mobile_banking', amount: 0 });
  }

  if (accountType === 'Agent') {
    balances.push({ type: 'main', amount: 0 });
  }

  if (accountType === 'Merchant') {
    const merchantBalanceTypes = [
      'main', 'pgo_income', 'donation_income', 'sales_income', 'cashback_income'
    ];
    merchantBalanceTypes.forEach(type => balances.push({ type, amount: 0 }));
  }

  return balances;
}

module.exports = initBalances;