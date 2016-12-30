const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const ora = require('ora');
const glob = require("glob");
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'search', alias: 's', type: String },
  { name: 'quality', alias: 'q', type: Number, defaultValue: 90 },
  { name: 'outdir', alias: 'o', type: String}
];

const options = commandLineArgs(optionDefinitions);
console.log(options);

const path = require('path');
let search = null;
let currentDir = __dirname
let outDir = currentDir;

if (options.search) {
  const spinner = ora('Minifying images');
  glob(options.search, {}, function(err, files) {
    console.log(files);

    if (files.length > 0) {
      spinner.start();

      if (!options.outdir) {
        options.outdir = path.dirname(files[0]);
      }

      imagemin(files, options.outdir, {use: [
          imageminMozjpeg({ quality: options.quality }),
          imageminPngquant({ quality: options.quality })
        ]}
      ).then(files => {
        spinner.stop();
        // console.log(files);
        console.log('Images optimized');
      })
      .catch(err => {
        console.log(err);
        spinner.stop();
        throw err;
      });
    } else {
      console.log("No images have been optimized.");
    }
  });
} else {
  console.log("Invalid search params");
}
