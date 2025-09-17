// utils/calculateTotalBalance.js
// গ্রাহককে দেখানোর জন্য: My Savings / My Loan বাদ দিয়ে total
function calculateTotalBalance(balances) {
  return balances
    .filter(b => b.type !== 'my_savings' && b.type !== 'my_loan') // গ্রাহককে দেখানো যাবে না
    .reduce((sum, b) => sum + (b.amount || 0), 0);
}

module.exports = calculateTotalBalance;