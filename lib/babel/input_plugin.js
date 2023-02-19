// 接受一个 babel-core 对象
module.exports = function(babel) {
  const {types: t} = babel
  return {
    pre(state) {
      // 前置操作，可选，可以用于准备一些资源
    },
    visitor: {
      // 我们的访问者代码将放在这里

      // 监听import类型
      ImportDeclaration(path, state) {
        // console.log('调用了自定义babel插件');
        return;
        if (path.node.source.value !== MODULE) {
          return
        }
    
        // 如果是空导入则直接删除掉
        const specs = path.node.specifiers
        if (specs.length === 0) {
          path.remove()
          return
        }
    
        // 判断是否包含了默认导入和命名空间导入
        if (specs.some(i => t.isImportDefaultSpecifier(i) || t.isImportNamespaceSpecifier(i))) {
          // 抛出错误，Babel会展示出错的代码帧
          throw path.buildCodeFrameError("不能使用默认导入或命名空间导入")
        }
    
        // 转换命名导入
        const imports = []
        for (const spec of specs) {
          const named = MODULE + '/' + spec.imported.name
          const local = spec.local
          imports.push(t.importDeclaration([t.importDefaultSpecifier(local)], t.stringLiteral(named)))
          imports.push(t.importDeclaration([], t.stringLiteral(`${named}/style.css`)))
        }
    
        // 替换原有的导入语句
        path.replaceWithMultiple(imports)
      
      },

      // 监听变量类型
      // Identifier(path, state) {
      //   console.log('变量类型')
      //   return;
      // },
    },
    post(state) {
      // 后置操作，可选
    }
  }
}

