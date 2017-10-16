/**
 * Base on GitHub Desktop script/package.js
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

const distInfo = require('./dist-info');

const distPath = distInfo.getDistPath();
const productName = distInfo.getProductName();

function packageWindows() {
  const electronInstaller = require('electron-winstaller');
  const outputDir = path.join(distInfo, '..', 'installer');

  if (!fs.existsSync(iconSource)) {
    console.error(`expected setup icon not found at location: ${iconSource}`);
    process.exit(1);
  }

  const nugetPkgName = distInfo.getWindowsIdentifierName();
  const options = {
    name: nugetPkgName,
    appDirectory: distPath,
    outputDirectory: outputDir,
    authors: distInfo.getAuthorName(),
    exe: `${nugetPkgName}.exe`,
    title: productName,
    setupExe: distInfo.getWindowsStandaloneName(),
    setupMsi: distInfo.getWindowsInstallerName()
  };

  electronInstaller
    .createWindowsInstaller(options)
    .then(() => {
      console.log(`Installers created in ${outputDir}`);
    })
    .catch(e => {
      console.error(`Error packaging: ${e}`);
      process.exit(1);
    });
}