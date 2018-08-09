/**
 * Base on GitHub Desktop script/start.ts
 * Source: https://github.com/desktop/desktop/blob/3540ed7/script/start.ts
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
import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';

import run from './run';
import config from '../config/webpack.development';

function startApp() {
  const runningApp = run({ stdio: 'inherit' });
  if (!runningApp) {
    console.error(
     "Couldn't launch the app. You probably need to build it first. Run `yarn build:dev`."
    );
    process.exit(1);
    return;
  }

  runningApp.on('close', () => {
    process.exit(0);
  });
}

if (process.env.NODE_ENV === 'production') {
  startApp();
  process.exit(0);
}

const rendererConfig = config[1];

const compiler = webpack(config[1]);
const port = 3000;

const devServer = new WebpackDevServer(
  compiler,
  rendererConfig.devServer as WebpackDevServer.Configuration,
);

devServer.listen(port, 'localhost', err => {
  if (err) {
    console.log(err);
    process.exit(1);
    return;
  }

  console.log(`Server running at http://localhost:${port}`);
  startApp();
});
