/**
 * Code helpers
 */
const tools = require('./tools');

/**
 * Require Node.js modules
 */
const fs = require('fs');
const Jimp = require('jimp');
const log = require('./logger');
const potrace = require('potrace');

/**
 * @class Contourer
 *
 * @property {Jimp} image
 * @property {String} imagePath
 * @property {String} outputImagePath
 * @property {String} encodedImage
 * @property {Object} size
 */
class Contourer {

  /**
   * @param pathToImage
   * @throws error if file does not exist
   */
  constructor (pathToImage) {
    if (!fs.existsSync(pathToImage)) {
      throw(`File ${pathToImage} does not exist`);
    }

    this.config = {
      debug: false,
      radius: 0,
      fillColor: 0x000000FF,
      contourColor: 0x000000FF
    };

    this.image = null;
    this.imagePath = pathToImage;
    this.svgContour = '';
    this.resultSVG = '';
    this.outputImagePath = tools.getPathWithoutExtension(pathToImage) + '.svg';
    this.encodedImage = '';
    this.size = {
      width: 0,
      height: 0
    };
  }

  /**
   * @async
   * Wrapper for Contourer class
   *
   * @param path - path to input image
   * @param config
   *
   * @returns {Promise<*>}
   */
  static async generateSVG(path, config = {}) {
    let image = new Contourer(path);

    for (const property in config) {
      image.config[property] = config[property];
    }

    try {
      await image.loadImage();
      await image.process();
      await image.createContour();
      await image.encodeImage();
      await image.mergeSvgAndEncodedBitmapImage();

      return await image.saveSVG();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * @async
   * Load Jimp image to this.image and get size
   */
  async loadImage() {
    log.info('Load image');

    this.image = await Jimp.read(this.imagePath);

    this.size.width = this.image.bitmap.width;
    this.size.height = this.image.bitmap.height;
  }

  /**
   * @async
   * Process image before tracing
   *
   * @returns {Promise<void>}
   */
  process() {

    return Promise.resolve()
      .then(() => {
        return log.info('Process image');
      })
      .then(() => {
        let shade = [];

        return new Promise((resolve, reject) => {
          this.image.scan(0, 0, this.size.width, this.size.height, (x, y, idx) => {

            let pixelColor = this.image.getPixelColor(x, y),
                colorObject = Jimp.intToRGBA(pixelColor);

            if (colorObject.a) {
              this.image.setPixelColor(this.config.fillColor, x, y);
              shade.push([x, y])
            }
          }, (err) => {
            if (err) {
              reject(err);
            }

            resolve(shade);
          });
      })})
      .then((shade) => {
        let contour = [];

        shade.forEach((pixel) => {
          let x = pixel[0],
              y = pixel[1],
              isContour = false;

          for (let i = x-1; i <= x+1; i++) {
            if (isContour) {
              break;
            }

            for (let j = y-1; j <= y+1; j++) {
              let pixelColor = this.image.getPixelColor(i, j),
                  colorObject = Jimp.intToRGBA(pixelColor);

              if (!colorObject.a) {
                contour.push([x, y]);
                isContour = true;
                break;
              }
            }
          }
        });

        return contour;
      })
      .then((contour) => {
        contour.forEach((pixel) => {
          let radius = this.config.radius,
              x = pixel[0],
              y = pixel[1];

          for (let i = x - radius; i <= x + radius; i++) {
            for (let j = y - radius; j <= y + radius; j++) {
              if (radius * radius >= ((x - i) * (x - i) + (y - j) * (y - j))) {
                try {
                  this.image.setPixelColor(this.config.fillColor, i, j);
                } catch (e) {
                  console.log(e);
                }
              }
            }
          }
        });

        return contour;
      })
      .then((contour) => {
        contour.forEach((pixel) => {
          let x = pixel[0],
              y = pixel[1];

          this.image.setPixelColor(this.config.contourColor, x, y);
        });

        return contour;
      });
  }

  /**
   * @async
   * Create SVG contour for image
   *
   * @returns {Promise<void>}
   */
  async createContour() {
    log.info('Create SVG contour');

    /**
     * Save raw svg to the variable this.svgContour
     */
    return new Promise((resolve, reject) => {
      try {
        let params = {
          color: 'none',
          outline: 'red'
        };

        /**
         * Create SVG contours by tracing target image
         *
         * @see https://github.com/talyguryn/node-potrace
         */
        potrace.trace(this.image, params, (err, svg) => {
          if (err) {
            throw err;
          }

          this.svgContour = svg;

          resolve()
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * @async
   * Prepare for creating result SVG
   * Encode image and save it to this.encodedImage
   * Use Jimp's getBase64 function (mime, callback)
   *
   * set mime = Jimp.AUTO for autodetection
   *
   * @returns {Promise<void>}
   */
  async encodeImage() {
    log.info('Encode image');

    if (this.config.debug) {
      /**
       * Encode processed image from memory
       */
      return new Promise((resolve, reject) => {
        try {
          this.image
            .getBase64(Jimp.AUTO, (err, encodedImage) => {
              if (err) {
                reject(err)
              }

              /**
               * Save encoded image to the variable
               */
              this.encodedImage = encodedImage;

              resolve()
            })
        } catch (e) {
          reject(e)
        }
      });
    }

    /**
     * Encode input image source file
     */
    return await Jimp.read(this.imagePath).then((image) => {
      return new Promise((resolve, reject) => {
        try {
          image.getBase64(Jimp.AUTO, (err, encodedImage) => {
            if (err) {
              throw(err);
            }

            /**
             * Save encoded image to the variable
             */
            this.encodedImage = encodedImage;

            return resolve();
          });
        } catch (e) {
          reject(e)
        }
      });
    });
  }

  /**
   * @async
   * Append encoded image to the end of SVG body
   */
  async mergeSvgAndEncodedBitmapImage() {
    log.info('Merge SVG and encoded image');

    /**
     * Register xlink param in SVG code
     * @type {string}
     */
    let result = this.svgContour.replace('xmlns="http://www.w3.org/2000/svg"', 'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"');

    /**
     * Generate image tag
     * @type {string}
     */
    let imageTag = `<image width="${this.size.width}" height="${this.size.height}" xlink:href="${this.encodedImage}" />`;

    /**
     * Add image tag at the end of SVG body
     * @type {string}
     */
    result = result.replace('</svg>', `${imageTag}</svg>`);

    this.resultSVG = result;
  }

  /**
   * @async
   * Save SVG to the output file
   *
   * @returns {String} - output file path
   */
  async saveSVG() {
    log.info('Save result SVG image');

    await fs.writeFileSync(this.outputImagePath, this.resultSVG);

    return this.outputImagePath
  }
}

module.exports = Contourer.generateSVG;
