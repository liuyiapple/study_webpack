// node 解决 路径的核心模块
const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const getStylesLoader = (pre) => {
  return [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['postcss-preset-env'], // 解决兼容性
        },
      },
    },
    pre,
  ].filter(Boolean)
}
module.exports = {
  // 入口
  entry: './src/main.js',
  // 出口
  output: {
    // 文件的输出路径，
    path: path.resolve(__dirname, '../dist'),
    // 文件名 只是 entry 的文件
    filename: undefined, // 绝对路径
    // 在 打包前清空 dist 目录
    clean: true,
  },
  //   加载器
  module: {
    rules: [
      // loader 的配置规则
      // css loader
      {
        test: /\.css$/, // 检测什么文件
        use: getStylesLoader(),
      },
      {
        test: /\.less$/i,
        use: getStylesLoader('less-loader'),
      },
      {
        test: /\.s[ac]ss$/i,
        use: getStylesLoader('sass-loader'),
      },

      {
        test: /\.(png|jpe?g|png|gif)/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            // 当图片大于 10 kb 的时候，就不会将图片转换成base64格式了
            // base 64格式的优点 ，将图片转换成字符串，减少服务器请求压力
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: 'static/image/[hash:10][ext]',
        },
      },
      // iconfont 打包处理·
      {
        test: /\.(ttf|woff2?)/,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[hash:10][ext]',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除 排除node_module 文件不做处理
        loader: 'babel-loader',
        // options: {
        //   presets: ['@babel/preset-env'],
        // },
      },
    ],
  },
  // 插件
  plugins: [
    new ESLintPlugin({
      //  检测那些文件
      context: path.resolve(__dirname, '../src'),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/main.css',
    }),
    new CssMinimizerPlugin(),
  ],
  //  webpack 本地 监听··· 开发环境下是没有输出的 也就是说 不会output
  // devServer: {
  //   host: 'localhost',
  //   port: '3000',
  //   open: true,
  // },
  // 模式
  mode: 'production',
}