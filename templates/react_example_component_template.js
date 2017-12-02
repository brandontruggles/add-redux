//An example React component using Redux to manage state

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { increment } from './actions';

class TestComponent extends Component {
  render() {
    return (
      <div>
	<p>This is a test React Redux app. Current counter value: {this.props.counter}</p>
	<button onClick={this.props.incrementFunc}>Increment Counter</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => { return {counter: state.incrementReducer.counter} }
const mapDispatchToProps = (dispatch) => { return {incrementFunc: () => { dispatch(increment(1)) }} }

export default connect(mapStateToProps, mapDispatchToProps)(TestComponent);
