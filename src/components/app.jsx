import React from 'react';
import './app.less';
import view from '~/assets/view.jpg';

const App = () => {
  return (
    <div class='app'>
      <span>webpack test demo1</span>
      <img src={view} alt="" srcset="" width={200}/>
    </div>
  );
};

export default App;
