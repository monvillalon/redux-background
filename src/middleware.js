import { JOB_ADD, JOB_STOP, JOB_STOPPED, JOB_REMOVE } from './types';
import createTicker from './ticker';

const tickers = {};
const middleware = store => next => (action) => {
  const { type } = action;
  switch (action.type) {
    case JOB_ADD: {
      const { name, fn } = action.payload;
      const options = action.meta;
      if (!tickers[name]) {
        tickers[name] = createTicker(store.dispatch, store.getState, name, fn, options)();
      }
      break;
    }
    case JOB_STOP:
    case JOB_STOPPED:
    case JOB_REMOVE: {
      const { name } = action.payload;
      const clear = type === JOB_REMOVE;
      if (tickers[name]) {
        tickers[name](clear);
        tickers[name] = null;
      }
      break;
    }
    default: {
      break;
    }
  }
  next(action);
};

export default middleware;
