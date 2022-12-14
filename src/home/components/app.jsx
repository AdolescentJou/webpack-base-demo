import React from 'react';
import './app.less';
import view from '~/home/assets/view.jpg';
import { commonAdd } from '../utils/treeshaking';
import ChildModule from './base/childModule';

// 测试无用代码删除组件
console.log(123);

// 全局变量测试
console.log(process.env);


const App = () => {

  // 动态加载module
  const loadNewModule = () => {
    import(/* webpackChunkName: "changeModuleName" */'./base/asyncImportModule').then((res) => console.log(res));
  };

  return (
    <div className='app'>
      <span>webpack test demo1</span>
      <img src={view} alt='' srcset='' width={200} />
      <button onClick={loadNewModule}>点我加载新模块</button>
      <ChildModule />
    </div>
  );
};

export default App;
