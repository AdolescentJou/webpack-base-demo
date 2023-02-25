const { parse: babelParse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
/*
  loader的功能:给所有promise方法中添加console.log('89757')
*/

module.exports = function (content, map, meta) {
  const ast = babelParse(content, { sourceType: 'unambiguous' });

  traverse(ast, {
    // enter: (path) => {
    //   const insertNode = null;
    //   // 找到promise节点
    //   if (path.node.type === 'Identifier' && path.node.name === 'Promise') {
    //     const __insertNode = path.parentPath;
    //     __insertNode.insertAfter(t.objectProperty(t.stringLiteral(key), t.stringLiteral('' + contentRs[key])));
    //   }
    // },
    NewExpression(path) {
      console.log(path.node.callee.name);
      if(path.node.callee.name === 'Promise'){
        console.log(111111);
      }
      // const tryCatchPath = path.findParent((p) => {
      //   return t.isTryStatement(p);
      // });
      // if (tryCatchPath) return path.skip();
      // /*
      //  这里leftId就是 = 左边的值，因为可能需要在catch里return，所以需要判断它的类型
      // */
      // const leftId = path.parent.id;
      // if (leftId) {
      //   const type = leftId.type;
      //   path.node.argument.returnType = type;
      // }
      // awaitMap.push(path.node.argument);
    },
  });
  return content;
};
