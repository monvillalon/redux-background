'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reducer;

var _types = require('./types');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case _types.JOB_ADDED:
      {
        var payload = action.payload,
            meta = action.meta;
        var name = payload.name;

        var item = _extends({
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
          timeoutId: null
        }, meta);
        return _extends({}, state, _defineProperty({}, name, item));
      }
    case _types.JOB_STARTED:
      {
        var _payload = action.payload,
            _meta = action.meta;
        var _name = _payload.name;
        var time = _meta.time;

        var _item = state[_name];
        var newItem = _extends({}, _item, {
          running: true,
          startedOn: time,
          progress: 0
        });
        return _extends({}, state, _defineProperty({}, _name, newItem));
      }
    case _types.JOB_PROGRESS:
      {
        var _payload2 = action.payload,
            _meta2 = action.meta;
        var _name2 = _payload2.name;
        var progress = _meta2.progress;

        var _item2 = state[_name2];
        var _newItem = _extends({}, _item2, { progress: progress });
        if (_item2.running) {
          return _extends({}, state, _defineProperty({}, _name2, _newItem));
        }
        return state;
      }
    case _types.JOB_FINISHED:
      {
        var _payload3 = action.payload,
            _meta3 = action.meta,
            error = action.error;
        var _name3 = _payload3.name,
            value = _payload3.value;
        var times = _meta3.times;

        var _item3 = state[_name3];
        var lastRanOn = _item3.startedOn;
        var finishedOn = Date.now();
        var lastDuration = Date.now() - _item3.startedOn;
        var _newItem2 = _extends({}, _item3, {
          times: times,
          running: false,
          startedOn: null,
          finishedOn: finishedOn,
          lastRanOn: lastRanOn,
          lastDuration: lastDuration,
          value: value,
          error: error,
          progress: 100
        });
        return _extends({}, state, _defineProperty({}, _name3, _newItem2));
      }
    case _types.JOB_STOPPED:
      {
        var _payload4 = action.payload;
        var _name4 = _payload4.name;

        var _item4 = state[_name4];
        var stoppedOn = Date.now();
        var _newItem3 = _extends({}, _item4, {
          active: false,
          running: false,
          stoppedOn: stoppedOn,
          progress: null
        });
        return _extends({}, state, _defineProperty({}, _name4, _newItem3));
      }
    case _types.JOB_REMOVE:
      {
        var _payload5 = action.payload;
        var _name5 = _payload5.name;

        var newState = _extends({}, state);
        delete newState[_name5];
        return newState;
      }
    case _types.JOB_TIMEOUT_ID:
      {
        var _payload6 = action.payload,
            _meta4 = action.meta;
        var _name6 = _payload6.name;
        var timeoutId = _meta4.timeoutId;

        var _item5 = state[_name6];
        var _newItem4 = _extends({}, _item5, { timeoutId: timeoutId });
        return _extends({}, state, _defineProperty({}, _name6, _newItem4));
      }
    default:
      {
        return state;
      }
  }
}
//# sourceMappingURL=reducer.js.map