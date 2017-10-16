import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { App } from 'containers';
import content from 'reducers/content';

const store = createStore(content);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.body
);