// node 解决 路径的核心模块
const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ThreserWebpackPlugins = require('terser-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

// const PreloadWebpackPlugin = require('preload-webpack-plugin')
// const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const os = require('os')
const threads = os.cpus().length // cpu 的核数
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
    // 在 打包前清空 dist 目录
    clean: true,
    // 文件名 只是 entry 的文件
    filename: 'static/js/[name].js', // 绝对路径
    // 打包生成的其他名字
    chunkFilename: 'static/js/[name].chunk.js',
    // 统一对其他资源进行处理
    assetModuleFilename: 'static/media/[hash:10][ext]',
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
        // generator: {
        //   filename: 'static/image/[hash:10][ext]',
        // },
      },
      // iconfont 打包处理·
      {
        test: /\.(ttf|woff2?)/,
        type: 'asset/resource',
        // generator: {
        //   filename: 'static/media/[hash:10][ext]',
        // },
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
  // 插件
  plugins: [
    new ESLintPlugin({
      //  检测那些文件
      context: path.resolve(__dirname, '../src'),
      exclude: 'node_modules',
      cacheLocation: path.resolve(
        __dirname,
        '../node_modules/.cache/eslintcache'
      ),
      threads,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
      chunkFilename: 'static/css/[name].chunk.css',
    }),
    new CssMinimizerPlugin(),
    // new ThreserWebpackPlugins({
    //   parallel: threads,
    // }),
    // new ImageMinimizerPlugin({
    //   minimizer: {
    //     implementation: ImageMinimizerPlugin.imageminGenerate,
    //     options: {
    //       plugins: [
    //         ['gifsicle', { interlaced: true }],
    //         ['jpegtran', { progressive: true }],
    //         ['optipng', { optimizationLevel: true }],
    //         [
    //           'svgo',
    //           {
    //             plugins: [
    //               'preset-default',
    //               'prefixIds',
    //               {
    //                 name: 'sortAttrs',
    //                 params: {
    //                   xmlnsOrder: 'alphabetical',
    //                 },
    //               },
    //             ],
    //           },
    //         ],
    //       ],
    //     },
    //   },
    // }),
    // new PreloadWebpackPlugin({
    //   rel: 'preload',
    //   as: 'script',
    // }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],

  //  压缩
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new ThreserWebpackPlugins({
        parallel: threads,
      }),
    ],
    // 代码分割操作
    splitChunks: {
      chunks: 'all',
    },
    // runtimeChunk: {
    //   name: (entryoption) => `runtime~${entryoption}.js`,
    // },
    // 更改 打包后的互相依赖js的hash
    runtimeChunk: true,
  },

  //  webpack 本地 监听··· 开发环境下是没有输出的 也就是说 不会output
  // devServer: {
  //   host: 'localhost',
  //   port: '3000',
  //   open: true,
  // },
  // 模式
  mode: 'production',
  devtool: 'source-map',
}
