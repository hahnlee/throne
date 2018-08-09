import * as path from 'path';

import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

import { mainConfig, rendererConfig } from './webpack.common';


const devConfig: webpack.Configuration = {
  devtool: 'source-map',
  mode: 'development',
};

const main = merge({}, mainConfig, devConfig);

const renderer = merge({}, rendererConfig, devConfig, {
  entry: {
    renderer: [
      'webpack/hot/dev-server',
      'webpack-dev-server/client?http://localhost:3000',
      path.resolve(__dirname, '..', 'src', 'index.tsx'),
    ],
  },
  output: {
    publicPath: 'http://localhost:3000/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              modules: true,
              namedExport: true,
              camelcase: true,
            },
          },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, '..', 'out'),
    host: 'localhost',
    compress: true,
    port: 3000,
    hot: true,
    inline: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});

export default [
  main,
  renderer,
];
