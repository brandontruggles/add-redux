import { applyMiddleware, createStore } from 'redux';
//<reducersImportLine>
//<loggerImportLine>
//<thunkImportLine>
//<promiseImportLine>


//<middlewareLine>

const store = createStore(reducers, middleware);

export default store;

