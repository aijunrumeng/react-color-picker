const fs = require('fs-extra');
const path = require('path');

class CopyFilePlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tap('CopyFilePlugin', (compilation, callback) => {
      // console.log(compilation, 'compilation');
      this.copy();
      // callback();
    });
  }

  copy() {
    const sourceDir = path.join(__dirname, '/../types');

    fs.readdir(sourceDir, async (err, files) => {
      if (err) throw new Error(err);

      for (const file of files) {
        const disrDir = path.join(__dirname + `/../lib/${file}`);
        try {
          await fs.copy(`${sourceDir}/${file}`, disrDir);
        } catch (error) {
          console.log(error);
        }
      }
    });
  }
}

module.exports = CopyFilePlugin;
