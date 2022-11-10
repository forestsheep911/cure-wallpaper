const { resolve } = require('path')
const isDev = process.env.NODE_ENV !== 'production'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const CopyPlugin = require('copy-webpack-plugin')

const cssLoaders = (preNumber) => [
  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      sourceMap: isDev,
      importLoaders: preNumber + 1,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          'postcss-flexbugs-fixes',
          [
            'postcss-preset-env',
            {
              autoprefixer: {
                grid: true,
                flexbox: 'no-2009',
              },
            },
          ],
          'postcss-normalize',
        ],
      },
      sourceMap: isDev,
    },
  },
]

const source = resolve(__dirname, '../src/renderer/logic')
const output = resolve(__dirname, '../dist')

module.exports = {
  entry: {
    app: resolve(source, 'index.ts'),
  },
  output: {
    filename: `js/[name]${isDev ? '' : '[contenthash:8]'}.js`,
    path: output,
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  externals: {
    // fs: 'require("fs")',
    // path: 'require("path")',
  },
  target: 'electron-renderer',
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../src/renderer/html/index.html'),
      filename: 'index.html',
      cache: false,
      minify: isDev
        ? false
        : {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            removeComments: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            useShortDoctype: true,
          },
    }),
    new webpack.DefinePlugin({
      process: {
        env: {},
      },
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        vue: true,
        configFile: resolve(__dirname, '../tsconfig.json'),
      },
    }),
    new VueLoaderPlugin(),
    new CopyPlugin({
      patterns: [
        {
          context: resolve(__dirname, '../src'),
          from: 'main.js',
          to: resolve(__dirname, '../dist'),
          toType: 'dir',
          // noErrorOnMissing: true,
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /.(ts|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: (file) => /node_modules/.test(file) && !/\.vue\.js\.ts/.test(file),
      },
      {
        test: /.ts$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          appendTsSuffixTo: [/\.vue$/],
        },
        exclude: /node_modules/,
      },
      {
        test: /.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: cssLoaders(0),
      },
      {
        test: /\.less$/,
        use: [
          ...cssLoaders(1),
          {
            loader: 'less-loader',
            options: {
              sourceMap: isDev,
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
        type: 'asset/inline',
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        type: 'asset/inline',
      },
    ],
  },
}
