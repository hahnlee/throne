/**
 * Base on GitHub Desktop script/run.ts
 * Source: https://github.com/desktop/desktop/blob/3540ed7/script/run.ts
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
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

import {
  getDistPath,
} from './dist-info';


const distPath = getDistPath();
const productName = 'throne';

function getBinaryPath() {
  if (process.platform === 'darwin') {
    return path.join(
      distPath,
      `${productName}.app`,
      'Contents',
      'MacOS',
      `${productName}`
    );
  }

  if (process.platform === 'win32') {
    return path.join(distPath, `${productName}.exe`);
  }

  if (process.platform === 'linux') {
    return path.join(distPath, productName);
  }

  throw new Error(`Throne doesn't support ${process.platform} ${process.arch}`);
}

export default function(spawnOptions: cp.SpawnOptions) {
  console.log(getBinaryPath());
  try {
    const stats = fs.statSync(getBinaryPath());
    if (!stats.isFile()) {
      return null;
    }
  } catch (e) {
    return null;
  }

  const opts = Object.assign({}, spawnOptions);

  opts.env = Object.assign(opts.env || {}, process.env, {
    NODE_ENV: 'development',
  });

  return cp.spawn(getBinaryPath(), [], opts);
}
