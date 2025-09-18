const DEFAULT_BALANCES = {
  Personal: [
    { type: 'salafi', currency: 'BDT', subTypes: ['main'] },
    { type: 'salafi', currency: 'USD', subTypes: ['main'] },
  ],
  Agent: [
    { type: 'salafi', currency: 'BDT', subTypes: ['main'] },
  ],
  Merchant: [
    { type: 'salafi', currency: 'BDT', subTypes: ['main'] },
    { type: 'bank', currency: 'BDT', subTypes: ['main'] },
    { type: 'fms', currency: 'BDT', subTypes: ['bKash','Rocket','Nagad','Upay','Tap'] },
    { type: 'salafi', currency: 'USD', subTypes: ['main'] },
    { type: 'bank', currency: 'USD', subTypes: ['main'] },
    { type: 'fms', currency: 'USD', subTypes: ['bKash','Rocket'] },
  ]
};

/**
 * নতুন গ্রাহকের জন্য ডিফল্ট ব্যালেন্স তৈরি
 */
function initBalances(accountType, existingBalances = []) {
  const balances = [...existingBalances];
  const defaults = DEFAULT_BALANCES[accountType] || [];

  defaults.forEach(def => {
    def.subTypes.forEach(sub => {
      // আগেই আছে কি না চেক
      if (!balances.some(b => b.type === def.type && b.subType === sub && b.currency === def.currency)) {
        balances.push({
          type: def.type,
          subType: sub,
          currency: def.currency,
          amount: 0
        });
      }
    });
  });

  return balances;
}

/**
 * ট্রানজেকশন বা নতুন কারেন্সি/সাব-টাইপ যোগ করার সময় ব্যালেন্স চেক
 */
function ensureBalanceExists(user, type, subType, currency) {
  let existing = user.balances.find(
    b => b.type === type && b.subType === subType && b.currency === currency
  );
  if (!existing) {
    const newBalance = { type, subType, currency, amount: 0 };
    user.balances.push(newBalance);
    return newBalance;
  }
  return existing;
}

module.exports = { initBalances, ensureBalanceExists };