'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _executor = require('./executor');

var _executor2 = _interopRequireDefault(_executor);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createTicker = function createTicker(dispatch, getState, name, fn) {
  var opts = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  return function () {
    var isStopped = false;
    var removeAfterStop = false;
    var times = 0;

    var options = _extends({
      interval: 1000,
      maxTimes: 1,
      data: null
    }, opts);
    var interval = options.interval,
        maxTimes = options.maxTimes,
        data = options.data;


    var job = {
      name: name,
      data: data,
      interval: interval,
      maxTimes: maxTimes,
      progress: function progress(p) {
        dispatch((0, _actions.jobProgress)(name, p));
      }
    };

    var stopFn = function stopFn(b) {
      isStopped = true;removeAfterStop = b;
    };
    var executor = (0, _executor2.default)(fn, job, dispatch, getState);
    var scheduler = function scheduler() {
      dispatch((0, _actions.jobStarted)(name, Date.now()));
      executor(function (err, value) {
        // Increment the times
        times += 1;

        // Notify about the jobFinished
        if (!isStopped) {
          dispatch((0, _actions.jobFinished)(name, err, value, Date.now(), times));
        }

        // See if we should stopJob
        var shouldStop = isStopped || maxTimes && times >= maxTimes;
        if (shouldStop) {
          if (removeAfterStop) {
            dispatch((0, _actions.removeJob)(name));
          } else {
            dispatch((0, _actions.jobStopped)(name));
          }
        } else {
          setTimeout(scheduler, interval);
        }
      });
    };

    // Notify that we added the job
    dispatch((0, _actions.jobAdded)(name, { interval: interval, maxTimes: maxTimes }));

    // Start the ticker
    setTimeout(scheduler, 0);

    // Return stopJob function
    return stopFn;
  };
};

exports.default = createTicker;
//# sourceMappingURL=ticker.js.map