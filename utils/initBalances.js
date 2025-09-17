const DEFAULT_BALANCES = {
  Personal: [
    { type: 'salafi', subTypes: ['main'] },
    { type: 'my_savings' }, // শুধুমাত্র হিসাব রাখার জন্য
    { type: 'my_loan' }     // শুধুমাত্র হিসাব রাখার জন্য
  ],
  Agent: [
    { type: 'salafi', subTypes: ['main'] }
  ],
  Merchant: [
    { type: 'salafi', subTypes: ['main'] },
    { type: 'bank', subTypes: ['main'] },
    { type: 'fms', subTypes: ['bKash', 'NAGAD', 'Rocket', 'Upay', 'Tap'] }
  ]
};

function initBalances(accountType, existingBalances = []) {
  const defaultBalances = DEFAULT_BALANCES[accountType] || [];
  const balances = [...existingBalances];

  defaultBalances.forEach(def => {
    // যদি একই টাইপ আগেই না থাকে
    if (!balances.some(b => b.type === def.type)) {
      if (def.subTypes && def.subTypes.length) {
        // প্রতিটি subType আলাদা balance এ add করা
        def.subTypes.forEach(st => balances.push({ type: def.type, subType: st, amount: 0 }));
      } else {
        balances.push({ type: def.type, amount: 0 });
      }
    }
  });

  return balances;
}

// মোট ব্যালেন্স গণনা (শুধুমাত্র Salafi + Bank + FMS)
function getTotalBalance(balances) {
  return balances
    .filter(b => ['salafi', 'bank', 'fms'].includes(b.type))
    .reduce((sum, b) => sum + (b.amount || 0), 0);
}

module.exports = { initBalances, getTotalBalance, DEFAULT_BALANCES };