function calculateTotalBalance(balances, currency = null) {
  return balances
    .filter(b => b.type !== 'my_savings' && b.type !== 'my_loan' && (!currency || b.currency === currency))
    .reduce((sum, b) => sum + (b.amount || 0), 0);
}

module.exports = calculateTotalBalance;