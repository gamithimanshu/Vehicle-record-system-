const { assertFirebaseReady } = require('../config/firebase-admin');

const VEHICLES_COLLECTION = 'vehicles';

function normalizeTimestamp(value) {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  return value;
}

function mapVehicleDocument(documentSnapshot) {
  const data = documentSnapshot.data() || {};

  return {
    id: documentSnapshot.id,
    ...data,
    createdAt: normalizeTimestamp(data.createdAt)
  };
}

async function listVehicles() {
  const { db } = assertFirebaseReady();
  const snapshot = await db.collection(VEHICLES_COLLECTION).orderBy('createdAt', 'desc').get();

  return snapshot.docs.map(mapVehicleDocument);
}

async function createVehicle(payload) {
  const { admin, db } = assertFirebaseReady();

  const documentReference = db.collection(VEHICLES_COLLECTION).doc();
  await documentReference.set({
    ...payload,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  const createdDocument = await documentReference.get();
  return mapVehicleDocument(createdDocument);
}

module.exports = {
  createVehicle,
  listVehicles
};
