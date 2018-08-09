import * as path from 'path';

import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

import { mainConfig, rendererConfig } from './webpack.common';


const productionConfig: webpack.Configuration = {
  mode: 'production',
};

const main = merge({}, mainConfig, productionConfig);

const renderer = merge({}, rendererConfig, productionConfig, {
  entry: {
    renderer: path.resolve(__dirname, '..', 'src', 'index.tsx'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
});

export default [
  main,
  renderer,
];
