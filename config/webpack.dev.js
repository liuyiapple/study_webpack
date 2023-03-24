// node 解决 路径的核心模块
const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const os = require('os')
const threads = os.cpus().length // cpu 的核数
const WorkboxPlugin = require('workbox-webpack-plugin')
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
      {
        oneOf: [
          // loader 的配置规则
          // css loader
          {
            test: /\.css$/, // 检测什么文件
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.less$/i,
            use: [
              // compiles Less to CSS
              'style-loader',
              'css-loader',
              'less-loader',
            ],
          },
          {
            test: /\.s[ac]ss$/i,
            use: [
              // 将 JS 字符串生成为 style 节点
              'style-loader',
              // 将 CSS 转化成 CommonJS 模块
              'css-loader',
              // 将 Sass 编译成 CSS
              'sass-loader',
            ],
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
              filename: '../static/image/[hash:10][ext]',
            },
          },
          // iconfont 打包处理·
          {
            test: /\.(ttf|woff2?)/,
            type: 'asset/resource',
            generator: {
              filename: '../static/media/[hash:10][ext]',
            },
          },
          {
            test: /\.js$/,
            // exclude: 'node_modules', // 排除 排除node_module 文件不做处理
            include: path.resolve(__dirname, '../src'),
            use: [
              {
                loader: 'thread-loader', // 开启多进程
                options: {
                  works: threads, // 进程数量
                },
              },
              {
                loader: 'babel-loader',
                options: {
                  // presets: ['@babel/preset-env'],
                  cacheDirectory: true, // 开启bable 缓存
                  cacheCompression: true, // 关闭缓存文件压缩
                  plugins: ['@babel/plugin-transform-runtime'],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  // 插件
  plugins: [
    new ESLintPlugin({
      //  检测那些文件
      context: path.resolve(__dirname, '../src'),
      exclude: 'node_modules',
      cache: true, // 开启缓存
      cacheLocation: path.resolve(
        __dirname,
        '../node_modules/.cache/eslintcache'
      ),
      threads,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new WorkboxPlugin.GenerateSW({
      clicentsClaim: true,
      skipWaiting: true,
    }),
  ],
  //  webpack 本地 监听··· 开发环境下是没有输出的 也就是说 不会output
  devServer: {
    host: 'localhost',
    port: '3000',
    open: true,
    hot: true, // 关闭hmr
  },
  // 模式
  mode: 'development',
  devtool: 'cheap-module-source-map',
}
