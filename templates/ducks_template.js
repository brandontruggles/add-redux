// Actions
const INCREMENT   = 'example_project/widgets/INCREMENT';

// Reducer
export default function reducer(state={counter: 0}, action) {
	var newState = Object.assign({}, state);
	if(action.type === INCREMENT) {
		newState.counter += action.payload;
	}
	return newState;
}

// Action Creators
export function increment(amount) {
    return { type: INCREMENT, payload: amount };
}

// Side effects, only as applicable
// e.g. thunks, epics, etc
//export function getWidget () {
//    return dispatch => get('/widget').then(widget => dispatch(updateWidget(widget)))
//}
