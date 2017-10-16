/**
 * Base on GitHub Desktop webpack.common.js
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
'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');

const outputDir = 'out';

const replacements = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
}

const commonConfig = {
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', outputDir),
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['es2015']
        }
      },
      {
        test: /\.node$/,
        use: [
          { loader: 'node-native-loader', options: { name: '[name].[ext]' } },
        ],
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin([outputDir], { verbose: false }),
    // This saves us a bunch of bytes by pruning locales (which we don't use)
    // from moment.
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  resolve: {
    extensions: ['.js'],
    modules: [path.resolve(__dirname, 'node_modules/')],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};

const mainConfig = merge({}, commonConfig, {
  entry: { main: path.resolve(__dirname, 'src/main-process/main') },
  target: 'electron-main',
  plugins: [
    new webpack.DefinePlugin(
      Object.assign({}, replacements, {
        __PROCESS_KIND__: JSON.stringify('main'),
      })
    ),
  ],
});

const rendererConfig = merge({}, commonConfig, {
  entry: { renderer: path.resolve(__dirname, 'src/ui/index') },
  target: 'electron-renderer',
  externals: {
    realm: 'realm'  // FIXME: https://github.com/realm/realm-js/issues/1060
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.(svg|png)$/,
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ],
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      path.resolve(__dirname, 'src/ui/'),
      path.resolve(__dirname, 'node_modules/'),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'static', 'index.html'),
      chunks: ['renderer'],
    }),
    new webpack.DefinePlugin(
      Object.assign({}, replacements, {
        __PROCESS_KIND__: JSON.stringify('ui'),
      })
    ),
  ],
});

module.exports = {
  main: mainConfig,
  renderer: rendererConfig,
};