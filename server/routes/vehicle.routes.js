const express = require('express');

const vehicleController = require('../controllers/vehicle.controller');

const router = express.Router();

router.route('/vehicles').get(vehicleController.getVehicles).post(vehicleController.createVehicle);

module.exports = router;
