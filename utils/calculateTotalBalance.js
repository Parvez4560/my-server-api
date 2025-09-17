// balance array থেকে total balance calculate করে return করে
function calculateTotalBalance(balances) {
  return balances.reduce((sum, b) => sum + (b.amount || 0), 0);
}

module.exports = calculateTotalBalance;