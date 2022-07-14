const fs = require('fs-extra');
const path = require('path');

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
    const sourceDir = path.join(__dirname + '/../types');
    const distDir = path.join(__dirname + '/../lib');

    fs.readdir(sourceDir, async (err, files) => {
      if (err) throw new Error(err);

      const distFile = `${distDir}/Picker.d.ts`;

      for (const file of files) {
        if (!file.includes('.d.ts')) return;

        const content = await fs.readFile(`${sourceDir}/${file}`, 'utf8');

        try {
          await fs.appendFile(distFile, content);
          fs.move(distFile, `${distDir}/index.d.ts`);
        } catch (error) {
          console.log(error);
        }
      }
    });
  }
}

module.exports = CopyFilePlugin;
