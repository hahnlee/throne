/**
 * Base on GitHub Desktop script/build.js
 * Copyright (c) GitHub, Inc.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const path = require('path');
const cp = require('child_process');
const fs = require('fs-extra');
const packager = require('electron-packager');

const {
  getReleaseChannel,
  getDistRoot,
  getExecutableName,
  getBundleID,
  getAuthorName,
  getProductName,
  getVersion,
} = require('./dist-info');

const projectRoot = path.join(__dirname, '..');
const outRoot = path.join(projectRoot, 'out');

const isPublishableBuild = getReleaseChannel() !== 'development';

console.log(`Building for ${getReleaseChannel()}…`);

console.log('Removing old distribution…');
fs.removeSync(getDistRoot());

console.log('Copying dependencies…');
copyDependencies();

packageApp((err, appPaths) => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log(`Built to ${appPaths}`);
  }
});

function copyDependencies() {
  const originalPackage = require(path.join(
    projectRoot,
    'app',
    'package.json'
  ));

  const commonConfig = require(path.resolve(__dirname, '../app/webpack.common'));
  const externals = commonConfig.externals;
  const oldDependencies = originalPackage.dependencies;
  const newDependencies = {};

  for (const name of Object.keys(oldDependencies)) {
    const spec = oldDependencies[name];
    newDependencies[name] = spec;
  }

  const oldDevDependencies = originalPackage.devDependencies;
  const newDevDependencies = {};
  
  if (!isPublishableBuild) {
    for (const name of Object.keys(oldDevDependencies)) {
      const spec = oldDevDependencies[name];
      newDevDependencies[name] = spec;
    }
  }
  
  // The product name changes depending on whether it's a prod build or dev
  // build, so that we can have them running side by side.
  const updatedPackage = Object.assign({}, originalPackage, {
    productName: getProductName(),
    dependencies: newDependencies,
    devDependencies: newDevDependencies,
  })
  
  if (isPublishableBuild) {
    delete updatedPackage.devDependencies;
  }
  
  fs.writeFileSync(
    path.join(outRoot, 'package.json'),
    JSON.stringify(updatedPackage)
  );

  fs.removeSync(path.resolve(outRoot, 'node_modules'));

  if (
    Object.keys(newDependencies).length ||
    Object.keys(newDevDependencies).length
  ) {
    console.log('  Installing npm dependencies…');
    cp.execSync('npm install', { cwd: outRoot, env: process.env });
  }
}

function toPackagePlatform(platform) {
  if (platform === 'win32' || platform === 'darwin' || platform === 'linux') {
    return platform;
  }
  throw new Error(
    `Unable to convert to platform for electron-packager: '${process.platform}`
  );
}

function packageApp(callback) {
  const options = {
    name: getExecutableName(),
    platform: toPackagePlatform(process.platform),
    arch: 'x64',
    asar: false,
    out: getDistRoot(),
    icon: path.join(projectRoot, 'app', 'static', 'logos', 'icon-logo'),
    dir: outRoot,
    overwrite: true,
    tmpdir: false,
    derefSymlinks: false,
    prune: false,
    ignore: [
      new RegExp('/node_modules/electron($|/)'),
      new RegExp('/node_modules/electron-packager($|/)'),
      new RegExp('/\\.git($|/)'),
      new RegExp('/node_modules/\\.bin($|/)'),
    ],
    win32metadata: {
      CompanyName: getAuthorName(),
      FileDescription: '',
      OriginalFilename: '',
      ProductName: getProductName(),
      InternalName: getProductName(),
    },
    appCopyright: 'Copyright © 2017 Han Lee',
  }

  packager(options, (err, appPaths) => {
    if (err) {
      callback(err, appPaths);
    } else {
      callback(null, appPaths);
    }
  });
}
