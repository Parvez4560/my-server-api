const mongoose = require('mongoose');

const userBalanceSchema = new mongoose.Schema({
  //  1. Salafi Balance (for personal & agent)
  salafi_balance: {
    main_balance: { type: Number, default: 0 },
    cashback_balance: { type: Number, default: 0 },
    promo_balance: { type: Number, default: 0 },
    reward_balance: { type: Number, default: 0 },
    return_balance: { type: Number, default: 0 },
    donation_credit: { type: Number, default: 0 },
    sevings_balance: { type: Number, default: 0 },   // সঞ্চয়
    loan_balance: { type: Number, default: 0 },
    distribution_balance: { type: Number, default: 0 },
    salary_balance: { type: Number, default: 0 }
  },

  //  2. Mobile Banking Balance (for merchant)
  mobile_banking_balance: {
    bkash_balance: { type: Number, default: 0 },
    nagad_balance: { type: Number, default: 0 },
    rocket_balance: { type: Number, default: 0 },
    upay_balance: { type: Number, default: 0 },
    tap_balance: { type: Number, default: 0 },
    pathao_pay_balance: { type: Number, default: 0 },
    ok_wallet_balance: { type: Number, default: 0 },
    islamic_wallet_balance: { type: Number, default: 0 },
    pocket_balance: { type: Number, default: 0 },
    m_cash_balance: { type: Number, default: 0 },
    meghna_pay_balance: { type: Number, default: 0 },
    st_pay_balance: { type: Number, default: 0 },
    cashbaba_balance: { type: Number, default: 0 }
  },

  //  3. Bank Balance
  bank_balance: {
    islami_bank_balance: { type: Number, default: 0 },
    dbbl_balance: { type: Number, default: 0 },
    brac_bank_balance: { type: Number, default: 0 },
    city_bank_balance: { type: Number, default: 0 },
    card_balance: { type: Number, default: 0 }
  },

  //  4. Bangla QR Balance
  bangla_qr_balance: {
    bkash_qr_balance: { type: Number, default: 0 },
    nagad_qr_balance: { type: Number, default: 0 },
    rocket_qr_balance: { type: Number, default: 0 },
    upay_qr_balance: { type: Number, default: 0 },
    tap_qr_balance: { type: Number, default: 0 },
    islami_qr_balance: { type: Number, default: 0 },
    other_qr_balance: { type: Number, default: 0 }
  }
});

module.exports = userBalanceSchema;