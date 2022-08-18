const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  // 入口出口配置
  entry: path.resolve(__dirname, 'src/index.jsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },

  plugins: [
    // 配置模板html
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      //       title: 'webpack test demo',
      //       filename: 'webpack.html',
    }),
    // 分离css
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    // 打包前先清空目录
    new CleanWebpackPlugin(),
  ],

  // 配置本地服务
  devServer: {
    contentBase: path.join(__dirname, 'dist'), //启动后外界访问资源的路径
    port: '8080',
    host: 'localhost',
    // 打开模块热替换
    hot: true,
  },

  // 配置loader
  module: {
    rules: [
      // 支持加载css文件
      {
        test: /\.css/,
        use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader'],
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.less/,
        use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader', 'less-loader'],
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
      },
      // 支持加载图片
      {
        test: /.(gif|jpg|png|bmp|eot|woff|woff2|ttf|svg)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              outputPath: 'images',
            },
          },
        ],
      },

      //支持转义ES6/ES7/JSX
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/react'],
              plugins: [[require('@babel/plugin-proposal-decorators'), { legacy: true }]],
            },
          },
        ],
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
      },
    ],
  },

  // 优化配置
  optimization: {
    minimizer: [
      // 配置压缩js
      new UglifyWebpackPlugin({
        parallel: 4,
      }),
      // 配置压缩css
      new OptimizeCssAssetsWebpackPlugin(),
    ],
  },
};
