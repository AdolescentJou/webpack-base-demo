class MyPlugin {
  // 构造方法
  constructor (options) {
    console.log('MyPlugin constructor:', options)
  }
  // 应用函数
  apply (compiler) {
    // 构建开始
    compiler.hooks.run.tap('console', (compilation) => {
      console.log("webpack 构建过程开始！");
    });
    // 构建完成
    compiler.hooks.done.tap('console', (compilation) => {
      console.log("构建完成");
    });
    // 资源构建完成
    compiler.hooks.assetEmitted.tap('console', (file) => {
      console.log('打包assets完成');
      console.log(file);
    })
  }
}

module.exports = MyPlugin;