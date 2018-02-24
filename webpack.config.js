const debug = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'src'),
  devtool: debug ? 'inline-sourcemap' : null,
  entry: ['babel-polyfill', './js/client.js'],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        },
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
        loader: 'file-loader',
        query: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  output: {
    path: `${__dirname}/dist/`,
    filename: 'client.min.js',
  },
  plugins: debug ? [
    new CopyWebpackPlugin([
      { from: 'static' }, { from: 'index.html' },
    ])] :
    [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false, compress: true }),
      new CopyWebpackPlugin([
        { from: 'static' }, { from: 'index.html' },
      ]),
    ],
};
