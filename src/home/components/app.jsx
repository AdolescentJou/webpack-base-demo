import React from 'react';
import './app.less';
import view from '~/home/assets/view.jpg';
import { add } from '../utils/treeshaking';
import ChildModule from './base/childModule';

var dyyhhh = 0;
console.log(123);
console.log(process.env);
const App = () => {
  // 动态加载module
  const loadNewModule = () => {
    import('./base/asyncImportModule').then((res) => console.log(res));
  };

  return (
    <div class='app'>
      <span>webpack test demo1</span>
      <img src={view} alt='' srcset='' width={200} />
      <button onClick={loadNewModule}>点我加载新模块</button>
      <ChildModule />
    </div>
  );
};

export default App;
