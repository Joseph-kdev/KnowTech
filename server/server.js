const app = require('./app');
const config = require('./config/config');


const server = app.listen(config.PORT, () => {
  console.log(`server running at ${config.PORT}`);
});