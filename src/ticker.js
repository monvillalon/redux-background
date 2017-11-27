import createExecutor from './executor';
import { jobAdded, jobStarted, jobProgress, jobFinished, jobStopped, removeJob, jobTimeoutId } from './actions';

const createTicker = (dispatch, getState, name, fn, opts = {}) => () => {
  let isStopped = false;
  let removeAfterStop = false;
  let times = 0;

  const options = {
    interval: 1000,
    maxTimes: 1,
    data: null,
    ...opts,
  };
  const { interval, maxTimes, data } = options;

  const job = {
    name,
    data,
    interval,
    maxTimes,
    progress(p) {
      dispatch(jobProgress(name, p));
    },
  };

  const stopFn = (b) => {
    isStopped = true;
    removeAfterStop = b;
    if (b) {
      const state = getState();
      if (state.background[name]) {
        clearTimeout(state.background[name].timeoutId);
      }
    }
  };
  const executor = createExecutor(fn, job, dispatch, getState);
  const scheduler = () => {
    dispatch(jobStarted(name, Date.now()));
    executor((err, value) => {
      // Increment the times
      times += 1;

      // Notify about the jobFinished
      if (!isStopped) {
        dispatch(jobFinished(name, err, value, Date.now(), times));
      }

      // See if we should stopJob
      const shouldStop = isStopped || (maxTimes && times >= maxTimes);
      if (shouldStop) {
        if (removeAfterStop) {
          dispatch(removeJob(name));
        } else {
          dispatch(jobStopped(name));
        }
      } else {
        const timeoutId = setTimeout(scheduler, interval);
        dispatch(jobTimeoutId(name, timeoutId));
      }
    });
  };

  // Notify that we added the job
  dispatch(jobAdded(name, { interval, maxTimes }));

  // Start the ticker
  const timeoutId = setTimeout(scheduler, 0);
  dispatch(jobTimeoutId(name, timeoutId));

  // Return stopJob function
  return stopFn;
};

export default createTicker;
