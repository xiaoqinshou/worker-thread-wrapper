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
});

var AbstractThreadFactory = /*#__PURE__*/_createClass(function AbstractThreadFactory() {
  _classCallCheck(this, AbstractThreadFactory);

  _defineProperty(this, "buildUri", function (jsScriprt) {
    var URL = window.URL || window.webkitURL;
    var blob = new Blob([jsScriprt], {
      type: 'application/javascript'
    });
    return URL.createObjectURL(blob);
  });
});

var SimpleThreadFactory = /*#__PURE__*/function (_AbstractThreadFactor) {
  _inherits(SimpleThreadFactory, _AbstractThreadFactor);

  var _super = _createSuper(SimpleThreadFactory);

  function SimpleThreadFactory() {
    var _this2;

    _classCallCheck(this, SimpleThreadFactory);

    _this2 = _super.call(this);

    _defineProperty(_assertThisInitialized(_this2), "buildScript", function (task) {
      return "\n  self.onmessage = function(event) {\n    var args = event.data.message.args\n    if (args) {\n      self.postMessage((".concat(task, ").apply(null, args))\n      return close()\n    }\n    self.postMessage((").concat(task, ")())\n    return close()\n  }");
    });

    _defineProperty(_assertThisInitialized(_this2), "getThread", function (task) {
      var uri = _this2.buildUri(_this2.buildScript(task));

      var worker = new Worker(uri);
      return {
        worker: worker,
        uri: uri
      };
    });

    _defineProperty(_assertThisInitialized(_this2), "destroy", function (_ref2) {
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

    return _this2;
  }

  return _createClass(SimpleThreadFactory);
}(AbstractThreadFactory);

var Thread = /*#__PURE__*/function (_ThreadBase) {
  _inherits(Thread, _ThreadBase);

  var _super2 = _createSuper(Thread);

  function Thread(threadFactory, deamonWorker) {
    var _this3;

    _classCallCheck(this, Thread);

    _this3 = _super2.call(this);

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

var SimpleThreadUnitFactory = /*#__PURE__*/function (_AbstractThreadFactor2) {
  _inherits(SimpleThreadUnitFactory, _AbstractThreadFactor2);

  var _super3 = _createSuper(SimpleThreadUnitFactory);

  function SimpleThreadUnitFactory() {
    var _this4;

    _classCallCheck(this, SimpleThreadUnitFactory);

    _this4 = _super3.call(this);

    _defineProperty(_assertThisInitialized(_this4), "buildScript", function (task) {
      return "\n  self.onmessage = function(event) {\n    var args = event.data.message.args\n    var task = event.data.message.task\n    if (args) {\n      self.postMessage(eval(task).apply(null, args))\n    }else{\n      self.postMessage(eval(task)())\n    }\n  }";
    });

    _defineProperty(_assertThisInitialized(_this4), "getThread", function (task) {
      var uri = _this4.buildUri(_this4.buildScript(task));

      var worker = new Worker(uri);
      return {
        worker: worker,
        uri: uri
      };
    });

    _defineProperty(_assertThisInitialized(_this4), "destroy", function (_ref3) {
      var worker = _ref3.worker,
          uri = _ref3.uri;

      if (worker) {
        worker.terminate();
      }

      if (uri) {
        var URL = window.URL || window.webkitURL;
        URL.revokeObjectURL(uri);
      }
    });

    return _this4;
  }

  return _createClass(SimpleThreadUnitFactory);
}(AbstractThreadFactory);

var AbstractThreadPoolExecutor = /*#__PURE__*/_createClass(function AbstractThreadPoolExecutor(options) {
  _classCallCheck(this, AbstractThreadPoolExecutor);
});

var TimeUnit;

(function (TimeUnit) {
  TimeUnit[TimeUnit["MILLISECONDS"] = 1] = "MILLISECONDS";
  TimeUnit[TimeUnit["SECONDS"] = 1000] = "SECONDS";
  TimeUnit[TimeUnit["MINUTES"] = 60000] = "MINUTES";
  TimeUnit[TimeUnit["HOURS"] = 3600000] = "HOURS";
  TimeUnit[TimeUnit["DAYS"] = 86400000] = "DAYS";
})(TimeUnit || (TimeUnit = {}));

var ArrayQueue = /*#__PURE__*/_createClass(function ArrayQueue(size) {
  var _this5 = this;

  _classCallCheck(this, ArrayQueue);

  _defineProperty(this, "element", void 0);

  _defineProperty(this, "length", void 0);

  _defineProperty(this, "size", function () {
    return _this5.element.length;
  });

  _defineProperty(this, "isEmpty", function () {
    return _this5.element.length === 0;
  });

  _defineProperty(this, "contains", function (e) {
    return _this5.element.includes(e);
  });

  _defineProperty(this, "toArray", function () {
    return Array.from(_this5.element);
  });

  _defineProperty(this, "iterator", function () {
    return _this5.element.values();
  });

  _defineProperty(this, "add", function (e) {
    if (_this5.element.length < _this5.length) {
      _this5.element.push(e);

      return true;
    }

    return false;
  });

  _defineProperty(this, "poll", function () {
    if (_this5.element.length > 0) {
      return _this5.element.shift();
    }

    return null;
  });

  _defineProperty(this, "peek", function () {
    if (_this5.element.length > 0) {
      return _this5.element[0];
    }

    return null;
  });

  this.length = size;
  this.element = [];
});

var ThreadPoolExecutor = /*#__PURE__*/function (_AbstractThreadPoolEx) {
  _inherits(ThreadPoolExecutor, _AbstractThreadPoolEx);

  var _super4 = _createSuper(ThreadPoolExecutor);

  function ThreadPoolExecutor(options) {
    var _this6;

    _classCallCheck(this, ThreadPoolExecutor);

    _this6 = _super4.call(this);

    _defineProperty(_assertThisInitialized(_this6), "corePoolSize", void 0);

    _defineProperty(_assertThisInitialized(_this6), "maximumPoolSize", void 0);

    _defineProperty(_assertThisInitialized(_this6), "keepAliveTime", void 0);

    _defineProperty(_assertThisInitialized(_this6), "timeUnit", void 0);

    _defineProperty(_assertThisInitialized(_this6), "workQueue", void 0);

    _defineProperty(_assertThisInitialized(_this6), "workerFactory", void 0);

    _defineProperty(_assertThisInitialized(_this6), "rejectedExecutionHandler", void 0);

    _defineProperty(_assertThisInitialized(_this6), "workerThread", void 0);

    _defineProperty(_assertThisInitialized(_this6), "interval", void 0);

    _defineProperty(_assertThisInitialized(_this6), "timeoutHandlers", []);

    _defineProperty(_assertThisInitialized(_this6), "submit", function (task) {
      var validTask = isValidObjectWith(['func', 'success'])(task);

      if (!validTask) {
        console.error(argumentError({
          expected: "a Object, and has Property ['func', 'success']",
          received: task
        }));
        return null;
      }

      var validWork = isValid(task.func)('function');

      if (!validWork) {
        console.error(argumentError({
          expected: 'a function',
          received: task.func
        }));
        return null;
      }

      var validArgs = isValid(task.args)(['array', 'undefined']);

      if (!validArgs) {
        console.error(argumentError({
          expected: 'an array',
          received: task.args
        }));
        return null;
      }

      var validSuccess = isValid(task.success)('function');

      if (!validSuccess) {
        console.error(argumentError({
          expected: 'a function',
          received: task.success
        }));
        return null;
      }

      var validError = isValid(task.error)(['function', 'undefined']);

      if (!validError) {
        console.error(argumentError({
          expected: 'a function',
          received: task.error
        }));
        return null;
      }

      return _this6.run(task);
    });

    _defineProperty(_assertThisInitialized(_this6), "run", function (task) {
      var addQueue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var thread = _this6.getIdleWorker(task);

      if (thread) {
        try {
          var success = function success(event) {
            worker.removeEventListener('message', success);
            thread.lock = false;
            task.success(event);
          };

          var error = function error(event) {
            worker.removeEventListener('error', error);
            thread.lock = false;
            console.error("Error: Line ".concat(error));
            task.error && task.error(event);
          };

          var worker = thread.thread.worker;
          worker.addEventListener('message', success);
          worker.addEventListener('error', error);
          worker.postMessage({
            message: {
              task: "(".concat(task.func.toString(), ")"),
              args: task.args
            }
          });
          thread.lock = true;
          return true;
        } catch (error) {
          console.error("this task ".concat(task.func, " error. thread running fails ").concat(error));
        }
      }

      if (addQueue) {
        var res = _this6.workQueue.add(task);

        if (!res) {
          _this6.rejectedExecutionHandler.rejectedExecution(task, _assertThisInitialized(_this6), new TypeError('task queue is full'));
        }

        if (!_this6.interval) {
          _this6.startConsumer();
        }
      }

      return false;
    });

    _defineProperty(_assertThisInitialized(_this6), "consumer", function () {
      var tasks = _this6.workQueue.toArray();

      var removeNums = 0;
      tasks.every(function (item) {
        var res = _this6.run(item, false);

        if (res) {
          removeNums++;
        }

        return res;
      });

      for (var i = 0; i < removeNums; i++) {
        _this6.workQueue.poll();
      }

      if (_this6.workQueue.isEmpty()) {
        clearInterval(_this6.interval);
        _this6.interval = undefined;
      }
    });

    _this6.corePoolSize = (options === null || options === void 0 ? void 0 : options.corePoolSize) || 5;
    _this6.maximumPoolSize = (options === null || options === void 0 ? void 0 : options.maximumPoolSize) || 10;
    _this6.keepAliveTime = (options === null || options === void 0 ? void 0 : options.keepAliveTime) || 30;
    _this6.timeUnit = (options === null || options === void 0 ? void 0 : options.timeUnit) || TimeUnit.SECONDS;
    _this6.workQueue = (options === null || options === void 0 ? void 0 : options.workQueue) || new ArrayQueue(20);
    _this6.workerFactory = (options === null || options === void 0 ? void 0 : options.workerFactory) || new SimpleThreadUnitFactory();
    _this6.rejectedExecutionHandler = (options === null || options === void 0 ? void 0 : options.rejectedExecutionHandler) || new DefalutHandler();
    _this6.workerThread = new Array(_this6.corePoolSize);

    _this6.initThread();

    return _this6;
  }

  _createClass(ThreadPoolExecutor, [{
    key: "startConsumer",
    value: function startConsumer() {
      this.interval = setInterval(this.consumer, ThreadPoolExecutor.DEFAULT_INTERVAL);
    }
  }, {
    key: "initThread",
    value: function initThread() {
      for (var i = 0; i < this.corePoolSize; i++) {
        this.workerThread[i] = {
          thread: this.workerFactory.getThread(),
          lock: false
        };
      }
    }
  }, {
    key: "getIdleWorker",
    value: function getIdleWorker(task) {
      var _this7 = this;

      var workerIndex = this.workerThread.findIndex(function (item) {
        return !item.lock;
      });

      if (workerIndex == -1) {
        if (this.workerThread.length < this.maximumPoolSize) {
          this.workerThread.push({
            thread: this.workerFactory.getThread(),
            lock: false
          });
          this.timeoutHandlers.push(setTimeout(function () {
            _this7.delayDestroy();
          }, this.keepAliveTime * this.timeUnit));
        } else {
          return;
        }
      }

      if (workerIndex >= this.corePoolSize) {
        var handlerIndex = workerIndex - this.corePoolSize;
        clearTimeout(this.timeoutHandlers[handlerIndex]);
        this.timeoutHandlers.splice(handlerIndex, 1, setTimeout(function () {
          _this7.delayDestroy();
        }, this.keepAliveTime * this.timeUnit));
      }

      return this.workerThread[workerIndex];
    }
  }, {
    key: "delayDestroy",
    value: function delayDestroy() {
      var workerIndex = -1;

      for (var i = this.workerThread.length - 1; i >= this.corePoolSize; i--) {
        if (!this.workerThread[i].lock) {
          workerIndex = i;
          break;
        }
      }

      if (workerIndex > -1) {
        var thread = this.workerThread[workerIndex];
        this.workerFactory.destroy(thread.thread);
        this.workerThread.splice(workerIndex, 1);
        var handlerIndex = workerIndex - this.corePoolSize;
        this.timeoutHandlers.splice(handlerIndex, 1);
      }
    }
  }]);

  return ThreadPoolExecutor;
}(AbstractThreadPoolExecutor);

_defineProperty(ThreadPoolExecutor, "DEFAULT_INTERVAL", 100);

var DefalutHandler = /*#__PURE__*/_createClass(function DefalutHandler() {
  _classCallCheck(this, DefalutHandler);

  _defineProperty(this, "rejectedExecution", function (task, poolExecutor, error) {
    console.error(error);
    task.error && task.error(error);
  });
});

var WorkerBuilder = /*#__PURE__*/_createClass(function WorkerBuilder() {
  var _this8 = this;

  _classCallCheck(this, WorkerBuilder);

  _defineProperty(this, "thread", void 0);

  _defineProperty(this, "threadPoolExecutor", void 0);

  _defineProperty(this, "build", function () {
    return _this8.thread;
  });

  _defineProperty(this, "buildPoolExecutor", function () {
    return _this8.threadPoolExecutor;
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
  this.threadPoolExecutor = ThreadPoolExecutor;
});

new WorkerBuilder();
