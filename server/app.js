const express = require('express');

const apiRoutes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/error-handler');

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (_request, response) => {
    response.json({
      name: 'vehicle-management-system-api',
      status: 'running'
    });
  });

  app.use('/api', apiRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp
};
