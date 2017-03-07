"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createExecutor = function createExecutor(fn) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return function (cb) {
    // Execute the function
    var result = void 0;
    try {
      // Get the result
      result = fn.apply(null, [].concat(args, [cb]));
    } catch (err) {
      // If the error raised an error report it
      cb(err, null);
      return;
    }

    // Check if the function returned a promise
    if (result && result.then && result.catch) {
      result.then(function (value) {
        cb(null, value);
      }).catch(function (err) {
        cb(err, null);
      });
      return;
    }

    // Check if the function didn't have a callback
    if (fn.length < 4) {
      cb(null, result);
    }
  };
};

exports.default = createExecutor;
//# sourceMappingURL=executor.js.map