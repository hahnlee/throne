/**
 * Base on GitHub Desktop webpack.production.js
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

const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabelPlugin = require('babel-webpack-plugin');

const common = require('./webpack.common');

const config = {
  devtool: 'source-map',
  plugins: [
    new BabelPlugin({
      test: /\.js$/,
      sourceMaps: true,
      compact: true,
      minified: true,
      comments: false,
      presets: [
        [
          'minify',
          {
            evaluate: false,
          },
        ],
      ],
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ]
};

const mainConfig = merge({}, common.main, config);

const rendererConfig = merge({}, common.renderer, config, {
  module: {
    rules: [
      // This will cause the compiled CSS to be output to a
      // styles.css and a <link rel="stylesheet"> tag to be
      // appended to the index.html HEAD at compile time
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        })
      }
    ]
  },
  plugins: [
    // Necessary to be able to use ExtractTextPlugin as a loader.
    new ExtractTextPlugin('ui.css')
  ]
});

module.exports = [
  mainConfig,
  rendererConfig
];