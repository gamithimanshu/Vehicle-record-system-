const express = require('express');

const { initializationError, isFirebaseReady } = require('../config/firebase-admin');

const router = express.Router();

router.get('/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'vehicle-management-api',
    firebase: {
      ready: isFirebaseReady,
      error: initializationError
    }
  });
});

module.exports = router;
