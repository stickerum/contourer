/**
 * Log module
 */
const SimpleNodeLogger = require('simple-node-logger');

let opts = {timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'},
    logger = SimpleNodeLogger.createSimpleLogger(opts);

module.exports = logger;
