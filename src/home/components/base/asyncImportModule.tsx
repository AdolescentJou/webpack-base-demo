import React from 'react';

// 该组件用于测试动态引入的module
console.log('console一下证明引入了文件');

const AsyncImportModule = () => {
  return <div className='module'>这是一个新的module</div>;
};

export default AsyncImportModule;
