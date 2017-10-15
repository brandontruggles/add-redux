//Any new reducers should follow this format. Reducers for similar actions should be declared in the same file, and that file should be imported into the reducers index.js file to be combined with all other reducers for the application.

export const sampleIncrementReducer = (state={counter: 0}, action) => {
	var newState = state;
	if(action.type === "SAMPLE_ACTION_INCREMENT") {
		newState.counter = action.payload;
	}
	return newState;
}

