const fs = require('fs');
const path = require('path');

const serverDir = path.resolve(__dirname, '..');
const projectDir = path.resolve(serverDir, '..');

loadEnvFile(path.join(projectDir, '.env'));
loadEnvFile(path.join(projectDir, '.env.local'));
loadEnvFile(path.join(serverDir, '.env'));

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');

    if (separatorIndex < 1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();

    if (!key || process.env[key] !== undefined) {
      continue;
    }

    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

module.exports = {
  port: Number(process.env.PORT || 3000),
  firebaseServiceAccountPath:
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(serverDir, 'serviceAccountKey.json'),
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  contactToEmail: process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER || '',
  contactFromEmail: process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || ''
};
