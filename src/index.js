/**
 * Autocreate svg outline for target image
 *
 * @author Taly Guryn
 */
const argv = require('minimist')(process.argv.slice(2)),
      pkg = require('../package.json');

const Contourer = require('./contourer');
const log = require('./logger');

const params = {
  /** Show help message */
  help: argv.help || argv.h || false,

  /** Debug image */
  debug: argv.debug || argv.d || false,

  /** Set image margin to be contoured */
  margin: argv.margin || argv.m || 0,

  /** Contour color */
  color: argv.color || argv.c || 'pink',

  /** Path to image to be processed */
  path: argv.path || argv.p || (argv._)[0]
};


/**
 * Prepare app
 */
const init = async () => {
  /**
   * Need to show help message
   */
  if (params.help !== false || !params.path) {
    await showHelp();
    process.exit();
  }

  await log.info('Start app');

  const config = {
    // debug: params.debug,
    margin: params.margin,
    contourColor: params.color
  };

  return await Contourer(params.path, config);
};

/**
 * Show Contourer's help page
 */
const showHelp = () => {

    const message = `
    _____         _
   |     |___ ___| |_ ___ _ _ ___ ___ ___ 
   |   --| . |   |  _| . | | |  _| -_|  _|
   |_____|___|_|_|_| |___|___|_| |___|_|  
            
${pkg.name} v${pkg.version} - ${pkg.description}

Usage: ./contourer [ path/to/image.png ] [options]
./contourer path/to/image.png --margin=15 --color=green

Options:
  -p, --path              path to image to be processed
  -m, --margin            margin size (default: 0)
  -c, --color             contour color (default: pink)
  -h, --help              show this help page

Sources, issues and improvements:
  https://github.com/stickerum/contourer
`;

    console.log(message);
};

const exit = (outputFile) => {
  log.info('Successfully complete\nResult: ', outputFile)
};

init()
  .then(exit)
  .catch(log.error);
