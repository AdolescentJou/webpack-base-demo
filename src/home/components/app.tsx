import React from 'react';
import './app.less';
import view from '~/home/assets/view.jpg';
import { commonAdd } from '../utils/treeshaking';
import ChildModule from './base/childModule';
import { add } from '../utils/func';

// 测试无用代码删除组件
console.log(123);

// 全局变量测试
console.log(process.env);

const x = add(1, 2);

const App = () => {
  console.log(x);
  
  // 动态加载module
  const loadNewModule = () => {
    import(/* webpackChunkName: "changeModuleName" */'./base/asyncImportModule').then((res) => console.log(res));
  };

  return (
    <div className='app'>
      <span>webpack test demo</span>
      <img src={view} alt='' width={200} />
      <button onClick={loadNewModule}>点我加载新模块</button>
      <ChildModule />
    </div>
  );
};

export default App;
