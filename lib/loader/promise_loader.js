
const { parse: babelParse } = require('@babel/parser');
/*
  loader的功能:给所有promise方法自动添加一层 try-catch
*/

module.exports = function (content, map, meta) {
  const ast = babelParse(content, { sourceType: 'unambiguous'});
  console.log(ast);
  return content;
};
