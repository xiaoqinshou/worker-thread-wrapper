'use strict';

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

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

var ThreadBase = /*#__PURE__*/_createClass(function ThreadBase() {
  _classCallCheck(this, ThreadBase);

  _defineProperty(this, "run", void 0);
});

var SimpleThreadFactory = /*#__PURE__*/_createClass(function SimpleThreadFactory() {
  var _this2 = this;

  _classCallCheck(this, SimpleThreadFactory);

  _defineProperty(this, "buildScript", function (task) {
    return "\n  self.onmessage = function(event) {\n    const args = event.data.message.args\n    if (args) {\n      self.postMessage((".concat(task, ").apply(null, args))\n      return close()\n    }\n    self.postMessage((").concat(task, ")())\n    return close()\n  }");
  });

  _defineProperty(this, "buildUri", function (jsScriprt) {
    var URL = window.URL || window.webkitURL;
    var blob = new Blob([jsScriprt], {
      type: 'application/javascript'
    });
    return URL.createObjectURL(blob);
  });

  _defineProperty(this, "getThread", function (task) {
    var uri = _this2.buildUri(_this2.buildScript(task));

    var worker = new Worker(uri);
    return {
      worker: worker,
      uri: uri
    };
  });

  _defineProperty(this, "destroy", function (_ref2) {
    var worker = _ref2.worker,
        uri = _ref2.uri;

    if (worker) {
      worker.terminate();
    }

    if (uri) {
      var URL = window.URL || window.webkitURL;
      URL.revokeObjectURL(uri);
    }
  });
});

var Thread = /*#__PURE__*/function (_ThreadBase) {
  _inherits(Thread, _ThreadBase);

  var _super = _createSuper(Thread);

  function Thread(threadFactory, deamonWorker) {
    var _this3;

    _classCallCheck(this, Thread);

    _this3 = _super.call(this);

    _defineProperty(_assertThisInitialized(_this3), "deamonWorker", void 0);

    _defineProperty(_assertThisInitialized(_this3), "threadFactory", void 0);

    _defineProperty(_assertThisInitialized(_this3), "thread", void 0);

    _defineProperty(_assertThisInitialized(_this3), "create", function (func) {
      _this3.thread = _this3.threadFactory.getThread(func);
    });

    _defineProperty(_assertThisInitialized(_this3), "createDeamonWorker", function (delay) {
      var that = _assertThisInitialized(_this3);

      if (!!delay && delay > 0) {
        var deammonTiming = that.deamonWorker.getDeamonWorker();
        return new Promise(function (resolve, reject) {
          deammonTiming.port.onmessage = function (e) {
            that.destroy();
            reject("".concat(e.data, ". this worker is closed"));
          };

          deammonTiming.port.postMessage([delay]);
        });
      }

      return undefined;
    });

    _defineProperty(_assertThisInitialized(_this3), "destroy", function () {
      if (_this3.thread) {
        _this3.threadFactory.destroy(_this3.thread);

        _this3.thread = undefined;
      }
    });

    _defineProperty(_assertThisInitialized(_this3), "run", function (task, args) {
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

      var that = _assertThisInitialized(_this3);

      _this3.create(task);

      return function (delay) {
        var deamonPromise = _this3.createDeamonWorker(delay);

        return new Promise(function (resolve, reject) {
          !!deamonPromise && deamonPromise["catch"](reject);

          that.thread.worker.onmessage = function (event) {
            that.destroy();
            resolve(event.data);
          };

          that.thread.worker.onerror = function (error) {
            console.error("Error: Line ".concat(error.lineno, " in ").concat(error.filename, ": ").concat(error.message));
            reject(error);
          };

          that.thread.worker.postMessage({
            message: {
              args: args
            }
          });
        });
      };
    });

    _this3.deamonWorker = deamonWorker || DeamonWorker;
    _this3.threadFactory = threadFactory || new SimpleThreadFactory();
    return _this3;
  }

  return _createClass(Thread);
}(ThreadBase);

var WorkerBuilder = /*#__PURE__*/_createClass(function WorkerBuilder() {
  var _this4 = this;

  _classCallCheck(this, WorkerBuilder);

  _defineProperty(this, "thread", void 0);

  _defineProperty(this, "build", function () {
    return _this4.thread;
  });

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
