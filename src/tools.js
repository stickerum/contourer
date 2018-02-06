/**
 * @module Tools
 * @description Code helpers
 */
class Tools {
  /**
   * Return path to file without extension
   * @param {string} filepath
   * @returns {string}
   */
  static getPathWithoutExtension(filepath) {
    return filepath.substring(0, filepath.lastIndexOf('.'));
  }
}

module.exports = Tools;
