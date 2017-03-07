'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types = require('./types');

var _ticker = require('./ticker');

var _ticker2 = _interopRequireDefault(_ticker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tickers = {};
var middleware = function middleware(store) {
  return function (next) {
    return function (action) {
      var type = action.type;

      switch (action.type) {
        case _types.JOB_ADD:
          {
            var _action$payload = action.payload,
                name = _action$payload.name,
                fn = _action$payload.fn;

            var options = action.meta;
            if (!tickers[name]) {
              tickers[name] = (0, _ticker2.default)(store.dispatch, store.getState, name, fn, options)();
            }
            break;
          }
        case _types.JOB_STOP:
        case _types.JOB_STOPPED:
        case _types.JOB_REMOVE:
          {
            var _name = action.payload.name;

            var clear = type === _types.JOB_REMOVE;
            if (tickers[_name]) {
              tickers[_name](clear);
              tickers[_name] = null;
            }
            break;
          }
        default:
          {
            break;
          }
      }
      next(action);
    };
  };
};

exports.default = middleware;
//# sourceMappingURL=middleware.js.map