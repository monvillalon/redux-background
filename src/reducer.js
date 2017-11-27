import { JOB_ADDED, JOB_STARTED, JOB_PROGRESS, JOB_FINISHED, JOB_STOPPED, JOB_REMOVE, JOB_TIMEOUT_ID } from './types';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case JOB_ADDED: {
      const { payload, meta } = action;
      const { name } = payload;
      const item = {
        times: 0,
        active: true,
        running: false,
        startedOn: null,
        finishedOn: null,
        lastRanOn: null,
        lastDuration: null,
        stoppedOn: null,
        value: null,
        error: null,
        progress: null,
        timeoutId: null,
        ...meta,
      };
      return { ...state, [name]: item };
    }
    case JOB_STARTED: {
      const { payload, meta } = action;
      const { name } = payload;
      const { time } = meta;
      const item = state[name];
      const newItem = {
        ...item,
        running: true,
        startedOn: time,
        progress: 0,
      };
      return { ...state, [name]: newItem };
    }
    case JOB_PROGRESS: {
      const { payload, meta } = action;
      const { name } = payload;
      const { progress } = meta;
      const item = state[name];
      const newItem = { ...item, progress };
      if (item.running) {
        return { ...state, [name]: newItem };
      }
      return state;
    }
    case JOB_FINISHED: {
      const { payload, meta, error } = action;
      const { name, value } = payload;
      const { times } = meta;
      const item = state[name];
      const lastRanOn = item.startedOn;
      const finishedOn = Date.now();
      const lastDuration = Date.now() - item.startedOn;
      const newItem = {
        ...item,
        times,
        running: false,
        startedOn: null,
        finishedOn,
        lastRanOn,
        lastDuration,
        value,
        error,
        progress: 100,
      };
      return { ...state, [name]: newItem };
    }
    case JOB_STOPPED: {
      const { payload } = action;
      const { name } = payload;
      const item = state[name];
      const stoppedOn = Date.now();
      const newItem = {
        ...item,
        active: false,
        running: false,
        stoppedOn,
        progress: null,
      };
      return { ...state, [name]: newItem };
    }
    case JOB_REMOVE: {
      const { payload } = action;
      const { name } = payload;
      const newState = { ...state };
      delete newState[name];
      return newState;
    }
    case JOB_TIMEOUT_ID: {
      const { payload, meta } = action;
      const { name } = payload;
      const { timeoutId } = meta;
      const item = state[name];
      const newItem = { ...item, timeoutId };
      return { ...state, [name]: newItem };
    }
    default: {
      return state;
    }
  }
}
