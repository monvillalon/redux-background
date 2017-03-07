'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeJob = exports.jobStopped = exports.stopJob = exports.jobFinished = exports.jobProgress = exports.jobStarted = exports.jobAdded = exports.startDaemon = exports.startJob = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _types = require('./types');

var startJob = exports.startJob = function startJob(name, fn) {
  var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return {
    type: _types.JOB_ADD,
    payload: { name: name, fn: fn },
    meta: meta
  };
};

var startDaemon = exports.startDaemon = function startDaemon(name, fn) {
  var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return {
    type: _types.JOB_ADD,
    payload: { name: name, fn: fn },
    meta: _extends({}, meta, { maxTimes: Infinity })
  };
};

var jobAdded = exports.jobAdded = function jobAdded(name, meta) {
  return {
    type: _types.JOB_ADDED,
    payload: { name: name },
    meta: meta
  };
};

var jobStarted = exports.jobStarted = function jobStarted(name, time) {
  return {
    type: _types.JOB_STARTED,
    payload: { name: name },
    meta: { time: time }
  };
};

var jobProgress = exports.jobProgress = function jobProgress(name, progress) {
  return {
    type: _types.JOB_PROGRESS,
    payload: { name: name },
    meta: { progress: progress }
  };
};

var jobFinished = exports.jobFinished = function jobFinished(name, error, value, time, times) {
  return {
    type: _types.JOB_FINISHED,
    payload: { name: name, value: value },
    error: error,
    meta: { time: time, times: times }
  };
};

var stopJob = exports.stopJob = function stopJob(name) {
  return {
    type: _types.JOB_STOP,
    payload: { name: name },
    meta: {}
  };
};

var jobStopped = exports.jobStopped = function jobStopped(name) {
  return {
    type: _types.JOB_STOPPED,
    payload: { name: name },
    meta: {}
  };
};

var removeJob = exports.removeJob = function removeJob(name) {
  return {
    type: _types.JOB_REMOVE,
    payload: { name: name },
    meta: {}
  };
};

exports.default = {
  startJob: startJob,
  startDaemon: startDaemon,
  jobAdded: jobAdded,
  jobStarted: jobStarted,
  jobProgress: jobProgress,
  jobFinished: jobFinished,
  stopJob: stopJob,
  jobStopped: jobStopped,
  removeJob: removeJob
};
//# sourceMappingURL=actions.js.map