import { combineReducers } from 'redux';
import { incrementReducer } from './sampleReducers';

//This is the root reducer object for the project. Any reducers should be created in external files in the reducers directory and imported into here, just like sampleIncrementReducer. The reducer name must then be added to the combineReducers() call below.

const reducers = combineReducers({
	incrementReducer,
});

export default reducers;
