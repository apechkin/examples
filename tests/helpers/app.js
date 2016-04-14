var nconfig = require('nconf');
var configPath = __dirname + '/../../config/';

nconfig.argv()
  .env()
  .defaults({
    'NODE_ENV': 'test'
  })
  .file('application', configPath + 'application.json')
  .file('database', configPath + 'database.json');

module.exports = require('../../app')(nconfig);
