const fs = require('fs-extra');

class CopyFilePlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('CopyFilePlugin', (compilation, callback) => {
      this.copy();
      callback();
    });
  }

  copy() {
    fs.readdir('./types', (err, files) => {
      if (err) throw new Error(err);

      files.forEach((file) => {
        fs.copy(`./types/${file}`, './lib/index.d.ts')
          .then(() => console.log('success!'))
          .catch((err) => console.error(err));
      });
    });
  }
}

module.exports = CopyFilePlugin;
