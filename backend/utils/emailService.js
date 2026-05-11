import nodemailer from 'nodemailer';
import dns from 'dns';

let transporter;

/**
 * Get or create nodemailer transporter
 */
const getTransporter = async () => {
  if (!transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('[SMTP ERROR] EMAIL_USER or EMAIL_PASS is missing in environment variables');
      throw new Error('Email configuration missing. Please set EMAIL_USER and EMAIL_PASS.');
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Force IPv4 at the DNS level to avoid ENETUNREACH error on Render
      lookup: (hostname, options, callback) => {
        dns.lookup(hostname || 'smtp.gmail.com', { family: 4 }, callback);
      },
      // Timeouts
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
    });

    try {
      await transporter.verify();
      console.log('[SMTP] Server is ready to take our messages');
    } catch (error) {
      console.error('[SMTP ERROR] Transporter verification failed:', error.message);
      transporter = null;
      throw new Error(`SMTP Verification Failed: ${error.message}`);
    }
  }
  return transporter;
};

/**
 * Send OTP Email
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP
 * @param {string} userName - User's name for personalization
 */
export const sendEmailOTP = async (email, otp, userName) => {
  const mailOptions = {
    from: `"Medify Hub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Login OTP for Medify Hub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #7367f0; text-align: center;">Medify Hub OTP Verification</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>You requested a login OTP for your Medify Hub account. Please use the 6-digit code below to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f4f4f4; padding: 10px 20px; border-radius: 5px; border: 1px dashed #7367f0;">
            ${otp}
          </span>
        </div>
        <p>This OTP is valid for <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          &copy; ${new Date().getFullYear()} Medify Hub Coaching Platform. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    const currentTransporter = await getTransporter();
    await currentTransporter.sendMail(mailOptions);
    console.log(`[EMAIL SUCCESS] OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send OTP to ${email}:`, error.message);
    // Return the actual error message so the user can see it in Postman
    throw new Error(`Email failed: ${error.message}`);
  }
};
