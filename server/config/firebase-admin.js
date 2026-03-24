const fs = require('fs');

const { firebaseServiceAccountPath } = require('./env');

let admin = null;
let db = null;
let auth = null;
let initializationError = null;

try {
  admin = require('firebase-admin');
} catch (_error) {
  initializationError = 'firebase-admin is not installed yet. Run npm install to add backend dependencies.';
}

if (admin) {
  try {
    if (!admin.apps.length) {
      if (!fs.existsSync(firebaseServiceAccountPath)) {
        throw new Error(
          `Firebase service account not found at ${firebaseServiceAccountPath}. Add server/serviceAccountKey.json or set FIREBASE_SERVICE_ACCOUNT_PATH.`
        );
      }

      const serviceAccount = JSON.parse(fs.readFileSync(firebaseServiceAccountPath, 'utf8'));

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    db = admin.firestore();
    auth = admin.auth();
  } catch (error) {
    initializationError = error.message;
  }
}

function assertFirebaseReady() {
  if (!db || !auth || !admin) {
    const error = new Error(initializationError || 'Firebase Admin is not configured.');
    error.statusCode = 503;
    throw error;
  }

  return { admin, db, auth };
}

module.exports = {
  admin,
  auth,
  db,
  isFirebaseReady: Boolean(admin && auth && db),
  initializationError,
  assertFirebaseReady
};
