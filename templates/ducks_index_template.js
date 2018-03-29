import { combineReducers } from 'redux';
import incrementReducer from './sampleDuck';

const reducers = combineReducers({
	incrementReducer,
});

export default reducers;
