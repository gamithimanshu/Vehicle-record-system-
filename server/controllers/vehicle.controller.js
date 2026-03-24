const vehicleService = require('../services/vehicle.service');

async function getVehicles(_request, response, next) {
  try {
    const vehicles = await vehicleService.listVehicles();
    response.json({ data: vehicles });
  } catch (error) {
    next(error);
  }
}

async function createVehicle(request, response, next) {
  try {
    const vehicle = await vehicleService.createVehicle(request.body || {});
    response.status(201).json({ data: vehicle });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createVehicle,
  getVehicles
};
