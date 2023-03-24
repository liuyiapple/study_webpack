module.exports = {
  extends: ['eslint:recommended'], // 继承 eslint
  env: {
    node: true, // 启用node 的全局变量
    browser: true, // 启用浏览器中的全局变量
  },
  parserOptions: {
    ecmaVersion: 6, // es6
    sourceType: 'module', // es module
  },
  rules: {
    'no-var': 2, // 不能用var
  },
  plugins: ['import'],
}
