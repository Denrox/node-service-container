const fs = require('fs');
const path = require('path');
const ServiceContainer = require('../lib');

fs.readFile(path.join(__dirname, './services-config.json'), 'utf8', (err, res) => {
  let sc;
  let baseDir = __dirname;

  if (err) {
    console.log(err);
  }

  sc = ServiceContainer.getInstance(baseDir, JSON.parse(res));

  sc.getService('fileLogger').logError('This is an example error text');
});
