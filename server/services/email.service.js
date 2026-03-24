const {
  contactFromEmail,
  contactToEmail,
  smtpHost,
  smtpPass,
  smtpPort,
  smtpSecure,
  smtpUser
} = require('../config/env');

let nodemailer = null;
let loadError = null;
let transporter = null;

try {
  nodemailer = require('nodemailer');
} catch (_error) {
  loadError = 'nodemailer is not installed yet. Run npm install to add email support.';
}

function getMailerConfigError() {
  if (loadError) {
    return loadError;
  }

  if (!smtpHost || !smtpUser || !smtpPass || !contactToEmail || !contactFromEmail) {
    return 'Email is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL.';
  }

  return null;
}

function getTransporter() {
  const configError = getMailerConfigError();

  if (configError) {
    const error = new Error(configError);
    error.statusCode = 503;
    throw error;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });
  }

  return transporter;
}

async function sendContactEmail({ email, message, name }) {
  const mailer = getTransporter();

  try {
    await mailer.sendMail({
      from: contactFromEmail,
      to: contactToEmail,
      replyTo: email,
      subject: `Vehicle Management contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #102033;">
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        </div>
      `
    });
  } catch (error) {
    const sendError = new Error(
      'Contact email delivery is unavailable right now. Please verify the SMTP settings and try again.'
    );
    sendError.statusCode = error.statusCode || 503;
    sendError.cause = error;
    throw sendError;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = {
  getMailerConfigError,
  sendContactEmail
};
