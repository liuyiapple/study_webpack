# Webpack 原理配置

## webpack 的 五大核心

### 1. entry 入口

 是用来告诉 webpack 从哪个文件 进入

### 2. output 输出

 通过 path 路径 告诉 webpack 打包好的文件输出到什么位置

```js
const path = require('path')
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: undefined, //  文件名称
    clear: true,
  },
}
```

### 3.module 加载器

```js
module.exports = {
  // 一般常见的加载器就是 css的loader ， 以及图片的压缩，js文件的压缩
  module: {
    rule: [
      {
        test: /\.css$/, // 检测什么文件
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
```

### 4.plugins 插件

webpack 的插件主要是作为扩展功能来使用的，常见的生成 html 和清除打包文件等

```js
modules.exports = {
  plugins: [
    new ESLintPlugin({
      // eslint 插件 主要是用来 检测文件、
      context: psth.resolve(__dirname, '../src'),
    }),
  ],
}
```

### 5. mode 模式

```js
// 模式就分为 生产模式 和 开发模式
mode: "development" ,  //. production
```

# 优化

## 1.sourceMap 映射文件

​	会生成一个xxx.map 方法，用来映射源代码和构建后代码 --- 映射的文件方案

```js
devtool : "source-map" // 开发模式
devtool : "cheap-module-source-map" // 生产模式
```

# 提升构建速度

## 1. HotModuleReplacement 

```js
hot : true // webpack5 默认是开启的

// webpack serve 默认在本地开启服务器
devServer: {
    host: 'localhost',
    port: '3000',
    open: true,
    hot: true, // 关闭hmr
},
```

## 2.oneOf	

​	让文件 只被其中一个处理，无需遍历所有的loader

## 3. Include/Exclude 

  Include 主要是作为打包时，要处理的文件包含哪些

​	Exclude	排除哪些文件

```js
include: path.resolve(__dirname, "../src")
exclude : "node_modules"
```

## 4. Cache 缓存

用来缓存之前的Eslint 主要是负责给之后的打包构建速度提升

```js
 {
    test: /\.js$/,
    // exclude: 'node_modules', // 排除 排除node_module 文件不做处理
    include: path.resolve(__dirname, '../src'),
    loader: 'babel-loader',
    options: {
      // presets: ['@babel/preset-env'],
      cacheDirectory: true, // 开启bable 缓存
      cacheCompression: true, // 关闭缓存文件压缩
    },
  },
```

eslint 缓存 plugins 中进行

```js
  new ESLintPlugin({
    //  检测那些文件
    context: path.resolve(__dirname, '../src'),
    exclude: 'node_modules',
    cacheLocation: path.resolve(
      __dirname,
      '../node_modules/.cache/eslintcache'
    ),
  }),
```

## 5. Thead 多进程

下载thread-loader  ，在node 环境中查询cpu 进程，让打包在多进程进行

```
npm i thread-loader -D
```

获取cpu 进程

```js
const os = require("os")
const threads = os.cpus().length
// 加载压缩
const ThreserWebpackPlugins = require('terser-webpack-plugins')
```



```js
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
      },
    },
  ],
},

```

压缩

```js
const ThreserWebpackPlugins = require('terser-webpack-plugins')
new ThreserWebpackPlugins({
  parallel: threads,
})
```

不同位置处理

```js
 //  压缩
optimization: {
  minimizeer:[
    new CssMinimizerPlugin(),
    new ThreserWebpackPlugins({
      parallel: threads,
    }),
  ]
}
```

# 减少代码体积

## 1. Tree shaking 减少代码体积

生产环境已经默认开启了这样的功能，只会在使用到该文件的地方才会被压缩  

减少第三方包工具

## 2. Babel JS压缩

```
npm i  @babel/plugin-transform-runtime -D
```

```js
{
    loader: 'babel-loader',
    options: {
      // presets: ['@babel/preset-env'],
      cacheDirectory: true, // 开启bable 缓存
      cacheCompression: true, // 关闭缓存文件压缩
      plugins: ['@babel/plugin-transform-runtime'],
    },
  },
```

```
@babel/plugin-transform-runtime 禁用了Babel自动对每个文件的runtime注入  而是引入
@babel/plugin-transform-runtime  并且使用所有辅助代码从这里引入
```

## 3. Image Minimizer 图片压缩

报错包很难下

```
npm i image-minimizer-webpack-plugin imagemin -D
```

无损压缩

```
npm i imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo -D
```

有损压缩

```
npm i imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo -D
```

```js
new ImageMinimizerPlugin({
  minimizer: {
    implementation: ImageMinimizerPlugin.imageminGenerate,
    options: {
      plugins: [
        ['gifsicle', { interlaced: true }],
        ['jpegtran', { progressive: true }],
        ['optipng', { optimizationLevel: true }],
        [
          'svgo',
          {
            plugins: [
              'preset-default',
              'prefixIds',
              {
                name: 'sortAttrs',
                params: {
                  xmlnsOrder: 'alphabetical',
                },
              },
            ],
          },
        ],
      ],
    },
  },
}),
```

## 4. codesplit 分割代码

多入口进入打包

当代码被多次被引用时，就不能进行多次打包了，而是进行合并

```js
optimization: {
    splitChunks: {
      chunks: 'all', // 触发默认配置
      cacheGroups: {
        default: {
          minSize: 0,
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
```

## 5. 动态导入,代码分割

```js
import () // 将代码进行分割 不执行都不会请求代码
```

```js
module.export = {
  // 文件名 只是 entry 的文件
    filename: 'static/js/[name].js', // 绝对路径
    // 打包生成的其他名字
    chunkFilename: 'static/js/[name].chunk.js',
    // 统一对其他资源进行处理
    assetModuleFilename: 'static/media/[hash:10][ext]',
} 
optimization: {
  // 代码分割操作
    splitChunks: {
      chunks: 'all',
    },
}

```

## 6. Preload/Prefetch

|          |           是什么           |            共同点            |              区别              |
| :------: | :------------------------: | :--------------------------: | :----------------------------: |
| Preload  |   告诉浏览器立即加载资源   | 加载资源，并不执行，都有缓存 |            优先级高            |
| Prefetch | 告诉浏览器在空闲时加载资源 | 加载资源，并不执行，都有缓存 | 优先级低，只在需要加载时才加载 |

这里又问题 ，npm 包下载不下来

## 7. NetWork cache

处理打包后的文件名称



## 8.core.js  JS兼容性问题

Es6  以上的 JS语法兼容

需要在babel.config.js 使用智能预设来判断需要处理什么样的语法

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: '3.0.0',
        targets: {
          chrome: '58',
          ie: '11',
        },
      },
    ],
  ],
}

```

## 9.PWA

当项目断网时仍能使用

```
npm i workbox-webpack-plugin -D
```

```js
plugins: {
 new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
}
```

```js
// PWA 入口文件配置
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
      .then((registration) => {
        console.log('SW registration', registration)
      })
      .catch((registrationError) => {
        console.log('SW registrationError', registrationError)
      })
  })
}
```

```
npm i serve -g 开启需要运行的目录即可
```

# 总结

1. 提升开发体验

   使用 source map 让开发或者线上代码报错能更加准确的错误提示

2. 提升webpack 的打包构建速度
   1. 使用HotModuleReplcement 让开发时止重新编译已经修改的代码，不变的代码进行缓存
   2. oneOf  资源文件一旦被某个loader 处理了，就不会再进行遍历了，打包速度更快
   3. Include/Exclude 排除或者检测某些文件，处理文件更少，速度更快
   4. cache 对 eslint 和babel 处理的结果进行缓存，让第二次打包速度等快
   5. 视同Thead 多线程处理eslint 和babel 任务，但是处理多线程是需要开销的，但是也比代码处理使用效率更高
3. 减少代码体积
   1. 使用Three shaking 剔除没用的多余的代码
   2. 使用@babel/plugin-transform-runtime  插件对babel处理，让辅助代码引入的更少
   3. 使用 Image Minimizer 对图片进行压缩
4. 优化代码运行性能
   1. 使用 Code split 对代码进行分割成多个js文件，减少单个文件的大小，提高js的运行速度，并通过import 动态导入加载资源
   2. 使用Preload 或者 Prefetch 对代码进行提前加载，等待未来使用时直接使用
   3. 使用Network Cache 对输出的文件更好的命名，做好缓存
   4. 使用 corejs 对js处理兼容性问题
   5. 使用PWA 让代码离线也能访问，提升用户体验







