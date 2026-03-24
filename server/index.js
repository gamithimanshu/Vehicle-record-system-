const { createApp } = require('./app');
const { port } = require('./config/env');

const app = createApp();

app.listen(port, () => {
  console.log(`Vehicle Management API listening on http://localhost:${port}`);
});
