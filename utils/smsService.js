const axios = require('axios');

// রেফারেন্স কোড তৈরি করার ফাংশন
function generateRefCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase() + Date.now().toString(36).toUpperCase();
}

// এসএমএস পাঠানোর ফাংশন
async function sendSms(phone, otp) {
  const refCode = generateRefCode();
  const message = `<#> NEVER share your Verification Code and PIN with anyone. Salafi never asks for these. Verification Code: ${otp}. Expiry: 30 seconds. ${refCode}`;

  try {
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        route: "v3",
        sender_id: "FSTSMS",
        message,
        language: "english",
        flash: 0,
        numbers: phone
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.return === true) {
      console.log(`✅ OTP sent to ${phone}:`, message);
      return { success: true, response: response.data };
    } else {
      throw new Error('SMS gateway responded with failure');
    }
  } catch (err) {
    console.error(`❌ Failed to send OTP to ${phone}:`, err.response?.data || err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendSms };