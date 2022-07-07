const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devConfig = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  entry: {
    index: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[name].js',
  },
  devServer: {
    host: 'localhost',
    historyApiFallback: true,
    open: true,
    port: 8281,
    hot: true, // 开启hmr功能
    proxy: {},
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')],
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer'),
                require('postcss-pxtorem')({
                  rootValue: 100,
                  propWhiteList: [],
                  minPixelValue: 2,
                }),
              ],
            },
          },
          'less-loader',
        ],
      },

      {
        test: /\.(jsx?|es6)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                [
                  'import',
                  {
                    libraryName: 'antd-mobile',
                    style: 'css',
                  },
                ],
                [
                  '@babel/plugin-proposal-decorators',
                  {
                    legacy: true,
                  },
                ],
                [
                  '@babel/plugin-proposal-class-properties',
                  {
                    loose: true,
                  },
                ],
                '@babel/plugin-transform-runtime',
              ],
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif|ico)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'static/images/[name].[ext]',
            limit: 1000,
          },
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.es6', '.ts', '.tsx'],
    fallback: { os: false },
  },
};

module.exports = devConfig;
