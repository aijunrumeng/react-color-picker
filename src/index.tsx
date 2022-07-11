import React from 'react';
import ReactDOM from 'react-dom';
import Picker from './Picker';
import Test from './Test';

void (function resizefn() {
  const html = document.documentElement;
  const w = Math.min(html.clientWidth, html.clientHeight);
  html.style.fontSize = Math.max(w, 320) / 7.5 + 'px';
})();

ReactDOM.render(<Test />, document.getElementById('root'));
