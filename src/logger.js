/**
 * Log module
 */
const SimpleNodeLogger = require('simple-node-logger');

let opts = {
      // logFilePath : 'logs/process.log',
      timestampFormat : 'YYYY-MM-DD HH:mm:ss.SSS'
    },
    logger = SimpleNodeLogger.createSimpleLogger(opts);

module.exports = logger;
