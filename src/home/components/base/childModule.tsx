import React from 'react';

import './base.less';
import { add } from '../../utils/func';

// 该组件用于测试 postcss 配置 css module
const ChildModule = () => {
  return <div className="module">这是一个子module</div>;
};

export default ChildModule;
