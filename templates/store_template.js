import { applyMiddleware, createStore } from 'redux';
import reducers from './reducers';
//<loggerImportLine>
//<thunkImportLine>
//<promiseImportLine>


//<middlewareLine>

const store = createStore(reducers, middleware);

export default store;

