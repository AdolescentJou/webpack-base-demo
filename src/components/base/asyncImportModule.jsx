import React from 'react';
import { baseConsole } from '~/utils/commonUtil';

// 用于动态引入的module
console.log('console一下证明引入了文件');

const AsyncImportModule = () => {
  baseConsole();
  return <div class='module'>这是一个新的module</div>;
};

export default AsyncImportModule;
