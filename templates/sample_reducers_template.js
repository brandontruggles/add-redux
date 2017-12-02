//Any new reducers should follow this format. Reducers for similar actions should be declared in the same file, and that file should be imported into the reducers index.js file to be combined with all other reducers for the application.

export const incrementReducer = (state={counter: 0}, action) => {
	var newState = Object.assign({}, state);
	if(action.type === "INCREMENT") {
		newState.counter += action.payload;
	}
	return newState;
}

