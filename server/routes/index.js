const express = require('express');

const contactRoutes = require('./contact.routes');
const healthRoutes = require('./health.routes');
const vehicleRoutes = require('./vehicle.routes');

const router = express.Router();

router.use(healthRoutes);
router.use(contactRoutes);
router.use(vehicleRoutes);

module.exports = router;
