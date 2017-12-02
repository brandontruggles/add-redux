//An example React app using Redux. To test this app out for yourself, we recommend using create-react-app to set up a fresh project, and then replacing the generated App.js with this file.The file TestComponent.js should be placed in the same directory as well. Then simply run 'npm run start' or 'yarn start' to view this example in your browser.

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import TestComponent from './TestComponent';
import store from './store';

class App extends Component {
  render() {
    return (
     <Provider store={store}>
	<TestComponent/>
     </Provider>
    );
  }
}

export default App;
