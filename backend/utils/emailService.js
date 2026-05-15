import { Resend } from 'resend';
import nodemailer from 'nodemailer';

let resendClient;
let nodemailerTransporter;

/**
 * Initialize Email Clients
 */
const getEmailClient = () => {
  // Try Resend first (Recommended for Production)
  const resendKey = process.env.RESEND_API_KEY;
  console.log('[DEBUG] RESEND_API_KEY length:', resendKey ? resendKey.length : 'NOT FOUND');
  if (resendKey) {
    if (!resendClient) {
      resendClient = new Resend(resendKey);
      console.log('[EMAIL] Initialized Resend client.');
    }
    return { type: 'resend', client: resendClient };
  }

  // Fallback to Nodemailer (Good for Local development)
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (user && pass) {
    if (!nodemailerTransporter) {
      nodemailerTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
      console.log('[EMAIL] Initialized Nodemailer (Gmail) fallback.');
    }
    return { type: 'nodemailer', client: nodemailerTransporter };
  }

  console.error('[EMAIL ERROR] No email configuration found. Please set RESEND_API_KEY or EMAIL_USER/PASS.');
  throw new Error('Email configuration missing.');
};

/**
 * Send OTP Email
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP
 * @param {string} userName - User's name for personalization
 */
export const sendEmailOTP = async (email, otp, userName) => {
  try {
    const { type, client } = getEmailClient();
    const subject = 'Your Login OTP for Medify Hub';
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #7367f0; text-align: center;">Medify Hub OTP Verification</h2>
          <p>Hello <strong>${userName || 'Student'}</strong>,</p>
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
      `;

    if (type === 'resend') {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Medify Hub <onboarding@resend.dev>';
      console.log(`[EMAIL] Sending via Resend from ${fromEmail} to ${email}...`);
      
      const { data, error } = await client.emails.send({
        from: fromEmail,
        to: email,
        subject,
        html: htmlContent,
      });

      if (error) throw new Error(`Resend Error: ${error.message}`);
      console.log(`[EMAIL SUCCESS] Sent via Resend. ID: ${data.id}`);
    } else {
      console.log(`[EMAIL] Sending via Nodemailer to ${email}...`);
      await client.sendMail({
        from: `"Medify Hub" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html: htmlContent,
      });
      console.log(`[EMAIL SUCCESS] Sent via Nodemailer.`);
    }

    return true;
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send OTP to ${email}:`, error.message);
    throw new Error(`Email failed: ${error.message}`);
  }
};

/**
 * Verification function
 */
export const verifyConnection = async () => {
  try {
    const { type, client } = getEmailClient();
    if (type === 'nodemailer') {
      await client.verify();
    }
    return true;
  } catch (error) {
    return false;
  }
};
