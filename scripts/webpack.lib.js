const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/Picker.tsx',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../lib'),
    libraryExport: 'default',
    library: 'ColorPicker',
    libraryTarget: 'umd',
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
        test: /\.(js|jsx)$/,
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
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, '../tsconfig.json'),
        },
      },
      {
        test: /\.(jpg|png|gif|ico)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: true,
          },
        },
      },
    ],
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new ProgressBarPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'package.json', to: 'package.json' },
        {
          from: 'types/index.d.ts',
          to: 'types/index.d.ts',
          force: true,
          priority: 5,
        },
      ],
    }),
  ],
};
