/**
 * Autocreate svg outline for target image
 *
 * @author Taly Guryn
 */
const argv = require('minimist')(process.argv.slice(2)),
    Contourer = require('./contourer'),
    log = require('./logger');

const imagePath = argv.p || argv.path || (argv._)[0];

/**
 * Prepare app
 */
const init = async () => {
  log.info('Start app');

  let config = {
    // debug: true,
    radius: 15,
    // contourColor: 0x0000FFFF
  };

  return await Contourer(imagePath, config);
};

const exit = (outputFile) => {
  log.info('Successfully complete\nResult: ', outputFile)
};

Promise.resolve()
  .then(init)
  .then(exit)
  .catch(log.error);
