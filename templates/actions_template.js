//Actions should take the same form as the sample below.

export function increment(num) {
	return {
		type: "INCREMENT",
		payload: num
	};
}

//This is an example async action using redux-thunk.
//By returning the promise returned by fetch, we can chain another .then() to perform more actions externally when a response is returned.

//import fetch from 'cross-fetch'; //This is a cross-platform http request library. This is not included with add-redux.

export function exampleAsync(url) {
	return function(dispatch) {
		dispatch(asyncRequest(url));
		/*return fetch(url) //Only uncomment this block if cross-fetch has been installed.
		.then((response) => {
			dispatch(asyncResponse(response));
		},
		err => {
			dispatch(asyncError(err));
		});*/
	};
}

//Each async action needs three child actions to handle the start of the action, the success of the action, or the failure of the action.

export function asyncRequest(request) {
	return {
		type: "ASYNC_REQUEST",
		payload: request
	};
}

export function asyncResponse(response) {
	return {
		type: "ASYNC_RESPONSE",
		payload: response
	};
}

export function  asyncError(err) {
	return {
		type: "ASYNC_ERROR",
		payload: err
	};
}

