import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

import common from './webpack.common.js';
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default merge(common, {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS into separate files
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, '../postcss/postcss.prod.js'),
              },
            },
          },
        ],
      },
      {
        test: /\.(s[ac]ss)$/i,
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS into separate files
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, '../postcss/postcss.prod.js'),
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Battleship',
      filename: 'index.html',
      inject: 'head',
      scriptLoading: 'defer',
      hash: true, // add hash to the file so filename is different on every build
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
      template: path.resolve(__dirname, '../../src/index.ejs'),
      favicon: path.resolve(__dirname, '../../favicon.ico'),
      links: [
        { rel: 'apple-touch-icon', href: 'https://cyclone-studios.s3.us-east-2.amazonaws.com/s3_cyclone-studios/alphaLogos/cycloneFavicons/apple-touch-icon.png' },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
  ],
});