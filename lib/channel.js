"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Channel = function () {
  function Channel(data) {
    (0, _classCallCheck3["default"])(this, Channel);

    var listeners = [];
    data = data || {};

    this.subscribe = function (fn) {
      listeners.push(fn);
    };

    this.unsubscribe = function (fn) {
      var idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };

    this.update = function (fn) {
      if (fn) fn(data);
      listeners.forEach(function (l) {
        return l(data);
      });
    };
  }

  return Channel;
}();

exports["default"] = Channel;