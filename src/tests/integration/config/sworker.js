'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Deamon = /*#__PURE__*/_createClass(function Deamon() {
  var _this = this;

  _classCallCheck(this, Deamon);

  _defineProperty(this, "objectUri", undefined);

  _defineProperty(this, "buildScript", function () {
    return "self.onconnect = function(e) {\n    var port = e.ports[0];\n    port.onmessage = function(e) {\n      const delay = e.data[0]\n      setTimeout(() => {\n        port.postMessage('timeOver')\n        port.close()\n      }, delay)\n    }\n  }";
  });

  _defineProperty(this, "buildUri", function (jsScriprt) {
    var URL = window.URL || window.webkitURL;
    var blob = new Blob([jsScriprt], {
      type: 'application/javascript'
    });
    _this.objectUri = URL.createObjectURL(blob);
  });

  _defineProperty(this, "create", function () {
    if (!_this.objectUri) {
      _this.buildUri(_this.buildScript());
    }
  });

  _defineProperty(this, "getDeamonWorker", function () {
    _this.create();

    return new SharedWorker(_this.objectUri);
  });
});

var DeamonWorker = new Deamon();

var isValid = function isValid(argument) {
  return function (types) {
    if (Array.isArray(types)) {
      return types.some(function (type) {
        return isValidArg(argument)(type);
      });
    }

    if (isValidArg(argument)(types)) {
      return true;
    }

    return false;
  };
};

var isValidArg = function isValidArg(arg) {
  return function (type) {
    if (type === 'null') {
      return arg === null;
    }

    if (type === 'undefined') {
      return arg === undefined;
    }

    if (type === 'action') {
      return isValidAction(arg);
    }

    if (Array.isArray(arg)) {
      if (type !== 'array' && !testArray[type]) return false;
      if (type === 'array') return true;
      return testArray[type](arg);
    }

    if (arg) {
      return _typeof(arg) === type.toString();
    }

    return false;
  };
};

var isValidAction = function isValidAction(obj) {
  return isValidObjectWith(['message', 'func'])(obj) && typeof obj.func === 'function' && typeof obj.message === 'string';
};

var isValidObjectWith = function isValidObjectWith(fields) {
  return function (obj) {
    return !!obj && !Array.isArray(obj) && fields.every(function (field) {
      return obj.hasOwnProperty(field);
    });
  };
};

var testArray = {
  'actionsArray': function actionsArray(arr) {
    return isValidActionsArray(arr);
  },
  'arraysArray': function arraysArray(arr) {
    return arr.every(function (item) {
      return Array.isArray(item);
    });
  },
  'objectsArray': function objectsArray(arr) {
    return isValidObjectsArray(arr)();
  },
  'postParamsArray': function postParamsArray(arr) {
    return isValidPostParamsArray(arr);
  },
  'stringsArray': function stringsArray(arr) {
    return arr.every(function (item) {
      return typeof item === 'string';
    });
  }
};

var isValidActionsArray = function isValidActionsArray(arr) {
  return arr.every(isValidAction);
};

var isValidObjectsArray = function isValidObjectsArray(arr) {
  return function () {
    var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return arr.every(isValidObjectWith(fields));
  };
};

var isValidPostParamsArray = function isValidPostParamsArray(arr) {
  return arr.every(isValidPostParams);
};

var isValidPostParams = function isValidPostParams(obj) {
  return isValidObjectWith(['message', 'args'])(obj) && Array.isArray(obj.args) && typeof obj.message === 'string';
};

var argumentError = function argumentError(_ref) {
  var _ref$expected = _ref.expected,
      expected = _ref$expected === void 0 ? '' : _ref$expected,
      received = _ref.received,
      _ref$extraInfo = _ref.extraInfo,
      extraInfo = _ref$extraInfo === void 0 ? '' : _ref$extraInfo;

  try {
    return new TypeError("".concat('You should provide ' + expected).concat('\n' + extraInfo).concat('\nReceived: ' + JSON.stringify(received)));
  } catch (err) {
    if (err.message === 'Converting circular structure to JSON') {
      return new TypeError("".concat('You should provide ' + expected).concat('\n' + extraInfo).concat('\nReceived a circular structure: ' + received));
    }

    throw err;
  }
};

var Thread = /*#__PURE__*/_createClass(function Thread(threadOptions) {
  var _this2 = this;

  _classCallCheck(this, Thread);

  _defineProperty(this, "deamonWorker", void 0);

  _defineProperty(this, "objectUri", void 0);

  _defineProperty(this, "worker", void 0);

  _defineProperty(this, "buildScript", function (task) {
    return "\n  self.onmessage = function(event) {\n    const args = event.data.message.args\n    if (args) {\n      self.postMessage((".concat(task, ").apply(null, args))\n      return close()\n    }\n    self.postMessage((").concat(task, ")())\n    return close()\n  }");
  });

  _defineProperty(this, "buildUri", function (jsScriprt) {
    var URL = window.URL || window.webkitURL;
    var blob = new Blob([jsScriprt], {
      type: 'application/javascript'
    });
    _this2.objectUri = URL.createObjectURL(blob);
  });

  _defineProperty(this, "create", function (func, delay) {
    var that = _this2;

    if (!that.objectUri) {
      var jsScriprtStr = _this2.buildScript(func);

      that.buildUri(jsScriprtStr);
    }

    if (!that.worker) {
      that.worker = new Worker(_this2.objectUri);
    }
  });

  _defineProperty(this, "createDeamonWorker", function (delay) {
    var that = _this2;

    if (!!delay && delay > 0) {
      var deammonTiming = that.deamonWorker.getDeamonWorker();
      return new Promise(function (resolve, reject) {
        deammonTiming.port.onmessage = function (e) {
          that.destroy();
          reject("".concat(e.data, ". this worker is closed"));
        };

        deammonTiming.port.postMessage([delay]);
        console.log("deamonWorker timing start...");
      });
    }

    return undefined;
  });

  _defineProperty(this, "destroy", function () {
    if (_this2.worker) {
      _this2.worker.terminate();

      _this2.worker = undefined;
    }

    if (_this2.objectUri !== "testUri") {
      var URL = window.URL || window.webkitURL;
      URL.revokeObjectURL(_this2.objectUri);
      _this2.objectUri = undefined;
    }
  });

  _defineProperty(this, "run", function (task, args) {
    var validWork = isValid(task)('function');
    var validArgs = isValid(args)(['array', 'undefined']);

    if (!validWork) {
      console.error(argumentError({
        expected: 'a function',
        received: task
      }));
      return null;
    }

    if (!validArgs) {
      console.error(argumentError({
        expected: 'an array',
        received: args
      }));
      return null;
    }

    var that = _this2;

    _this2.create(task);

    return function (delay) {
      var deamonPromise = _this2.createDeamonWorker(delay);

      return new Promise(function (resolve, reject) {
        !!deamonPromise && deamonPromise["catch"](reject);

        that.worker.onmessage = function (event) {
          that.destroy();
          resolve(event.data);
        };

        that.worker.onerror = function (error) {
          console.error("Error: Line ".concat(error.lineno, " in ").concat(error.filename, ": ").concat(error.message));
          reject(error);
        };

        that.worker.postMessage({
          message: {
            args: args
          }
        });
      });
    };
  });

  this.objectUri = threadOptions === null || threadOptions === void 0 ? void 0 : threadOptions.objectUri;
  this.worker = threadOptions === null || threadOptions === void 0 ? void 0 : threadOptions.worker;
  this.deamonWorker = (threadOptions === null || threadOptions === void 0 ? void 0 : threadOptions.deamonWorker) || DeamonWorker;
});

var WorkerBuilder = /*#__PURE__*/_createClass(function WorkerBuilder() {
  var _this3 = this;

  _classCallCheck(this, WorkerBuilder);

  _defineProperty(this, "thread", void 0);

  _defineProperty(this, "build", function () {
    return _this3.thread;
  });

  this.thread = /*#__PURE__*/function () {
    function _class2() {
      _classCallCheck(this, _class2);

      _defineProperty(this, "run", function () {
        console.error('This browser does not have the conditions for execution');
      });
    }

    return _createClass(_class2);
  }();

  if (!window.Worker) {
    console.error('This browser does not support Workers.');
    return;
  }

  if (!window.SharedWorker) {
    console.error('This browser does not support SharedWorker.');
    return;
  }

  if (!(window.URL.createObjectURL || window.webkitURL.createObjectURL)) {
    console.error('This browser does not have URL.createObjectURL method.');
    return;
  }

  this.thread = Thread;
});

new WorkerBuilder();
