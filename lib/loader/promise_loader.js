const { parse: babelParse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const babelGenerator = require('@babel/generator').default;
/*
  loader的功能:给所有promise方法中添加console.log('89757')
*/

// pitch loader的执行会在loader之前，这里可以传递数据在loader中访问
module.exports.pitch = function (content, map, meta) {
  console.log('调用了pitch loader');
  return;
};

module.exports = function (content, map, meta) {
  const consoleAst = babelParse(`console.log('89757')`, { sourceType: 'unambiguous' });

  // 解析并找到需要插入的console节点
  let insertNode = null;
  traverse(consoleAst, {
    enter: (path) => {
      // 找到console.log节点
      if (path.node.type === 'CallExpression') {
        insertNode = path.node;
      }
    },
  });

  const ast = babelParse(content, { sourceType: 'unambiguous' });

  traverse(ast, {
    enter: (path) => {
      // 找到promise节点
      if (path.node.type === 'NewExpression' && path.node.callee.name === 'Promise') {
        path.node.arguments[0].body.body.push(insertNode);
      }
    },
    // 这种方式可以通过访问 New 表达式找到Promise节点
    // NewExpression(path) {
    //   if(path.node.callee.name === 'Promise'){
    //   }
    // },
  });

  const transform_content = babelGenerator(ast, { sourceType: 'unambiguous' });
  return transform_content.code;
};
