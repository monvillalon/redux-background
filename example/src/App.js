import React, { Component } from 'react';
import { connect } from 'react-redux';
import Promise from 'bluebird';
import { addDaemon, stopJob, removeJob } from '../../src/actions';
import './App.css';

class App extends Component {
  render() {
    const { running, data, onStart, onStop, onClear } = this.props;
    return (
      <div className="container">

        <h3> Lastest Random Number </h3>
        <strong>{data.value || 'None'}</strong>

        <h3> Progress </h3>
        <div className="progress">
          <div className="progress-bar" role="progressbar" style={{ width: `${data.progress}%` }}>
            <span className="sr-only">${data.progress}% Complete</span>
          </div>
        </div>

        <div className="btn-group center">
          <button className="btn btn-primary btn-default" onClick={onStart} disabled={running}>
            Start
          </button>
          <button className="btn btn-primary btn-default" onClick={onStop} disabled={!running}>
            Stop
          </button>
          <button className="btn btn-primary btn-default" onClick={onClear}>
            Clear
          </button>
        </div>

        <h3> Raw Data </h3>
        <pre>
          {JSON.stringify(data, null, 4)}
        </pre>

      </div>
    );
  }
}

async function createRandomNumber(job, dispatch, getState) {
  const { min, max } = job.data;
  job.progress(0);
  await Promise.delay(500);
  job.progress(25);
  await Promise.delay(500);
  job.progress(75);
  await Promise.delay(500);
  return Math.round((Math.random() * (max - min)) + min);
}

function mapStateToProps(state) {
  return {
    running: state.background.random && state.background.random.active,
    data: state.background.random || { progress: 0 },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStart() {
      dispatch(addDaemon('random', createRandomNumber, {
        data: {
          min: 0,
          max: 10,
        },
      }));
    },
    onStop() {
      dispatch(stopJob('random'));
    },
    onClear() {
      dispatch(removeJob('random'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
