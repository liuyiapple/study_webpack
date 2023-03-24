// 智能预设
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
