/* eslint import/no-dynamic-require: 0 */
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// get required env vars
const { NODE_ENV } = process.env;
// throw error if they don't exist
if (!NODE_ENV) {
  throw new Error('Please set NODE_ENV and CONFIG environment variables');
}

// get right mode
const mode = (NODE_ENV && NODE_ENV.trim() === 'production') ? 'production' : 'development';

const shouldGenSourceMap = mode !== 'production';

/**
 * Plugins
 */
const plugins = [
  new webpack.ProvidePlugin({
    THREE: 'three',
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.resolve('index.html'),
    minify: {
      removeComments: mode === 'production',
      collapseWhitespace: mode === 'production',
      removeAttributeQuotes: mode === 'production',
    },
  }),
  new CleanWebpackPlugin(),
];

/**
 * Webpack config
 */
module.exports = {
  mode,
  watch: mode === 'development',
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
  },
  entry: {
    index: path.resolve(`${__dirname}/index.js`),
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['last 2 versions', 'safari >= 7'],
                  },
                }],
              ],
            },
          },
        ],
      },

      {
        test: /\.(jpe?g|png|gif|svg)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[hash].[ext]',
            },
          },
        ],
      },

      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: mode === 'production',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules',
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        cache: true,
        sourceMap: shouldGenSourceMap,
      }),
    ],
  },
  plugins,
  devtool: (mode === 'production') ? false : 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    host: '0.0.0.0',
    port: 9000,
    historyApiFallback: true,
  },
};
