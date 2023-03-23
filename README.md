# Webpack 原理配置

## webpack 的 五大核心

### 1. entry  入口

​	是用来告诉webpack 从哪个文件 进入 

### 2. output 输出 

​	通过path 路径 告诉webpack 打包好的文件输出到什么位置

```js
const path = require('path')
module.exports = {
  	output: {
      path: path.resolve(__dirname,"dist"),
      filename: undefined , //  文件名称
      clear: true
    }
}

```

### 3.module  加载器

```js
module.exports = {
  // 一般常见的加载器就是 css的loader ， 以及图片的压缩，js文件的压缩
  	module: {
      rule:[
        {
        	test: /\.css$/, // 检测什么文件
        	use: ['style-loader', 'css-loader'],
      },
      ]
    }
}
```

### 4.plugins  插件

webpack 的插件主要是作为扩展功能来使用的，常见的生成html 和清除打包文件等

```js
modules.exports = {
  plugins : [
    new ESLintPlugin({
      // eslint 插件 主要是用来 检测文件、
      context: psth.resolve(__dirname,"../src")
    })
  ]
}
```

### 5. mode 模式

```js
// 模式就分为 生产模式 和 开发模式
mode: "development" ,  //. production
```





































