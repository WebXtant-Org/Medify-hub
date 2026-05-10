import nodemailer from 'nodemailer';

let transporter;

/**
 * Get or create nodemailer transporter
 */
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
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
    const currentTransporter = getTransporter();
    await currentTransporter.sendMail(mailOptions);
    console.log(`[EMAIL SUCCESS] OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Email Send Error:', error.message);
    throw new Error('Failed to send email OTP. Please check your credentials.');
  }
};
