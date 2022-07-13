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
    const sourceDir = path.join(__dirname, '/../lib');

    fs.readdir(sourceDir, async (err, files) => {
      if (err) throw new Error(err);

      const dist = path.join(__dirname + `/../lib/index.d.ts`);

      for (const file of files) {
        if (!file.includes('.d.ts')) return;
        if (file.includes('index.d.ts')) return;

        const content = await fs.readFile(`${sourceDir}/${file}`, 'utf8');

        try {
          await fs.appendFile(dist, content);
          fs.remove(`${sourceDir}/${file}`);
        } catch (error) {
          console.log(error);
        }
      }
    });
  }
}

module.exports = CopyFilePlugin;
