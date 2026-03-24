const { assertFirebaseReady } = require('../config/firebase-admin');

const CONTACT_COLLECTION = 'contactMessages';

async function createContactSubmission(payload) {
  const { admin, db } = assertFirebaseReady();
  const documentReference = db.collection(CONTACT_COLLECTION).doc();

  await documentReference.set({
    ...payload,
    submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return {
    id: documentReference.id
  };
}

async function markContactSubmissionSent(id) {
  const { admin, db } = assertFirebaseReady();

  await db.collection(CONTACT_COLLECTION).doc(id).set(
    {
      emailStatus: 'sent',
      emailedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );
}

async function markContactSubmissionFailed(id, emailError) {
  const { admin, db } = assertFirebaseReady();

  await db.collection(CONTACT_COLLECTION).doc(id).set(
    {
      emailError,
      emailStatus: 'failed',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );
}

module.exports = {
  createContactSubmission,
  markContactSubmissionFailed,
  markContactSubmissionSent
};
