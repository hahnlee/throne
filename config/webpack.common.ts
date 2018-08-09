import * as path from 'path';

import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';


const commonConfig: webpack.Configuration = {
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', 'out'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
        options: {
          useBabel: true,
          useCache: true,
        },
      },
      {
        test: /\.(svg|png)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: [
      '.js',
      '.ts',
      '.tsx',
    ],
    modules: [
      path.resolve(__dirname, '..', 'src'),
      path.resolve(__dirname, '..', 'node_modules'),
    ],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};

export const mainConfig = merge({}, commonConfig, {
  entry: {
    main: path.resolve(__dirname, '..', 'src', 'main', 'index.ts'),
  },
  target: 'electron-main',
});

export const rendererConfig = merge({}, commonConfig, {
  entry: {
    renderer: path.resolve(__dirname, '..', 'src', 'index.tsx'),
  },
  externals: {
    realm: 'require("realm")',
  },
  target: 'electron-renderer',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'src', 'index.html'),
    }),
  ],
});
