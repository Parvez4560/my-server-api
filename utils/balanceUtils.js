const User = require('../models/User');
const { ensureBalanceExists } = require('./initBalances');

/**
 * ব্যালেন্স ক্রেডিট করা (যোগ করা)
 * @param {String} phoneNumber - ইউজারের ফোন নাম্বার
 * @param {String} type - balance type (salafi, bank, fms)
 * @param {String} subType - balance subType
 * @param {String} currency - BDT, USD, ...
 * @param {Number} amount - যোগ করতে হবে এমন পরিমাণ
 */
async function creditBalance(phoneNumber, type, subType, currency, amount) {
  const user = await User.findOne({ phoneNumber });
  if (!user) throw new Error('User not found');

  const balance = ensureBalanceExists(user, type, subType, currency);
  balance.amount += amount;

  await user.save();
  return balance;
}

/**
 * ব্যালেন্স ডেবিট করা (কাটা)
 * @param {String} phoneNumber
 * @param {String} type
 * @param {String} subType
 * @param {String} currency
 * @param {Number} amount
 */
async function debitBalance(phoneNumber, type, subType, currency, amount) {
  const user = await User.findOne({ phoneNumber });
  if (!user) throw new Error('User not found');

  const balance = ensureBalanceExists(user, type, subType, currency);

  if (balance.amount < amount) throw new Error('Insufficient balance');
  balance.amount -= amount;

  await user.save();
  return balance;
}

/**
 * মোট ব্যালেন্স নির্দিষ্ট কারেন্সি অনুযায়ী
 * @param {String} phoneNumber
 * @param {String} currency - যদি null হয়, সব কারেন্সি যোগ হবে
 */
async function getTotalBalance(phoneNumber, currency = null) {
  const user = await User.findOne({ phoneNumber });
  if (!user) throw new Error('User not found');

  return user.balances
    .filter(b => !['my_savings', 'my_loan'].includes(b.type) && (!currency || b.currency === currency))
    .reduce((sum, b) => sum + (b.amount || 0), 0);
}

/**
 * নির্দিষ্ট টাইপ এবং সাবটাইপ অনুযায়ী ব্যালেন্স দেখা
 */
async function getBalance(phoneNumber, type, subType, currency) {
  const user = await User.findOne({ phoneNumber });
  if (!user) throw new Error('User not found');

  const balance = ensureBalanceExists(user, type, subType, currency);
  return balance;
}

module.exports = {
  creditBalance,
  debitBalance,
  getTotalBalance,
  getBalance
};