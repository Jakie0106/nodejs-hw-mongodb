import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendResetEmail = async (email, name, token) => {
  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Password Reset',
    html: ` <p>Hi ${name},</p> 
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <p><a href="${resetLink}">click here</a> to reset your password</p> 
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Best regards,<br>Your App Team</p> `,
  };

  await transporter.sendMail(mailOptions);
};
