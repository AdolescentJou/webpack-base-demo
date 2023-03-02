const { parse: babelParse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const babelGenerator = require('@babel/generator').default;
/*
  loader的功能:对对象属性进行判断和追加
  例
      如果对象存在 borderImage：xxx 属性
      则给对象添加 border: xxx 属性
*/
module.exports = function (content, map, meta) {
  const ast = babelParse(content, { sourceType: 'unambiguous' });
  const astTrans = new ASTtrans(ast);

  //存入转化规则
  astTrans.addDealFunc('find_node_key', { add_key: 'this is a new value' });

  //开始转化
  astTrans.excute();

  const newAst = astTrans.getResult();

  const transform_content = babelGenerator(newAst, { sourceType: 'unambiguous' });

  return transform_content.code;
};
class ASTtrans {
  ast = null;
  _path = null;
  dealMap = new Map();

  constructor(ast) {
    this.ast = ast;
  }

  query(path, key) {
    if (path.node.type === 'ObjectProperty' && path.node.key.name === key) {
      this._path = path;
    }
    // 这里存储节点，然后返回this是方便链式调用
    return this;
  }

  append(inserObj) {
    if (!this._path) return;
    Object.keys(inserObj).forEach((key) => {
      this._path.insertAfter(t.objectProperty(t.stringLiteral(key), t.stringLiteral(inserObj[key])));
    });
    this._path = null;
  }

  addDealFunc(key, inserObj) {
    this.dealMap.set(key, inserObj);
  }

  excute() {
    traverse(this.ast, {
      enter: (path) => {
        for (const iterator of this.dealMap) {
          const [key, insertObj] = iterator;
          this.query(path, key).append(insertObj);
        }
      },
    });
  }

  getResult() {
    return this.ast;
  }
}
