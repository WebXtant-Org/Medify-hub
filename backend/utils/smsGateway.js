import axios from 'axios';

/**
 * Send SMS using Fast2SMS Gateway
 * @param {string} mobile - 10 digit mobile number
 * @param {string} otp - The OTP to send
 */
export const sendSMS = async (mobile, otp) => {
  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey) {
    console.warn('[SMS WARNING] FAST2SMS_API_KEY is missing in .env. Falling back to console log.');
    console.log(`[BACKEND OTP] For ${mobile}: ${otp}`);
    return;
  }

  try {
    // Using Fast2SMS Quick SMS API
    const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
      variables_values: otp,
      route: 'otp',
      numbers: mobile,
    }, {
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('SMS Gateway Error:', error.response?.data || error.message);
    throw new Error('Failed to send SMS');
  }
};
