/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 */

(function moduleify(moduleFactory) {
  'use strict';

  var awextLib = null;

  if (typeof define === 'function' && define.amd) {
    define('awext', ['statecore'], function (dep1) {
      awextLib = awextLib || moduleFactory(dep1);
      return awextLib;
    });
  } else if (typeof module === 'object' && typeof exports === 'object') {
    awextLib = awextLib || moduleFactory([require('statecore')]);
    module.exports = awextLib;
  }

  var root = (typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this);
  if (root && typeof root === 'object') {
    awextLib = awextLib || moduleFactory(root['statecore']);
    root['awext'] = awextLib;
    root['Awext'] = awextLib;
  }
}(function moduleFactory(deps_Statecore) {
  'use strict';

  if (!deps_Statecore) throw new Error('Awext depends on Statecore! - https://github.com/statecore/statecore');
  var _AwextLib_ = {};

  var prototypeHasOwn = Object.prototype.hasOwnProperty;
  function _hasOwn(obj, key) {
    return obj !== undefined && obj !== null && prototypeHasOwn.call(obj, key);
  }

  function _hasKey(obj, key) {
    return obj !== undefined && obj !== null && (key in Object(obj));
  }
  _AwextLib_.hasKey = _hasKey;

  var prototypeToString = Object.prototype.toString;
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill
  var ARRAY_TYPE_STRINGIFY = Object.prototype.toString.call([]);
  function _isArray(value) {
    return prototypeToString.call(value) === ARRAY_TYPE_STRINGIFY;
  }

  var Counter__UUID = 0;
  function _genUUID() {
    Counter__UUID += 1;
    return Counter__UUID + '__' + Date.now() + '__' + Math.random();
  }
  _AwextLib_.genUUID = _genUUID;

  function _blankFunction() { }

  function _isNone(value) {
    if (value === undefined || null === value) return true;
    if ('number' === typeof value && isNaN(value)) return true;
    return false;
  }
  _AwextLib_.isNone = _isNone;

  function _isNumber(value) {
    return !isNaN(value);
  }
  _AwextLib_.isNumber = _isNumber;

  function _isKeyValueObject(value) {
    return value !== null && 'object' === typeof value && prototypeToString.call(value) !== ARRAY_TYPE_STRINGIFY;
  }
  _AwextLib_.isKeyValueObject = _isKeyValueObject;

  function _isBoolean(value) {
    return typeof value === 'boolean';
  }

  function _isFunction(value) {
    return 'function' === typeof value;
  }
  _AwextLib_.isFunction = _isFunction;

  function _isString(value) {
    return 'string' === typeof value;
  }

  function _isRegExp(value) {
    return value instanceof RegExp;
  }
  _AwextLib_.isRegExp = _isRegExp;

  function _isPromise(obj) {
    return !!obj && ('object' === typeof obj || 'function' === typeof obj) && 'function' === typeof obj.then;
  }
  _AwextLib_.isPromise = _isPromise;

  function _objectAssign(target) {
    if (_isNone(target)) throw new TypeError('Cannot convert undefined or null to object');
    var isTargetArray = _isArray(target);
    var to = Object(target);
    if (isTargetArray) {
      for (var iArray = 1; iArray < arguments.length; iArray += 1) {
        var nextArray = arguments[iArray];
        if (_isArray(nextArray)) {
          to.push.apply(to, nextArray);
        } else {
          to.push.call(to, nextArray);
        }
      }
    } else {
      for (var iObject = 1; iObject < arguments.length; iObject += 1) {
        var nextObj = arguments[iObject];
        if (!_isNone(nextObj)) {
          for (var nextKey in nextObj) {
            if (_hasOwn(nextObj, nextKey)) {
              to[nextKey] = nextObj[nextKey];
            }
          }
        }
      }
    }
    return to;
  }
  _AwextLib_.objectAssign = _objectAssign;

  function _objectKeys(obj) {
    var keys = [];
    for (var key in obj) {
      keys.push(key);
    }
    return keys;
  }

  function _objectOwnKeysForEach(obj, cb) {
    var keys = _objectKeys(obj); // get all keys before operate it.
    for (var idx in keys) {
      var key = keys[idx];
      if (_hasOwn(obj, key)) {
        if (cb(key, obj) === false) {
          return;
        }
      }
    }
  }

  function _bind(func, bindThis) {
    if (func.bind) return func.bind(bindThis);
    return function () {
      return func.apply(bindThis, arguments);
    };
  }

  function _objectBindProps(target) {
    if (_isNone(target)) throw new TypeError('Cannot convert undefined or null to object');
    var to = Object(target);
    var argsLength = arguments.length;
    for (var iObject = 1; iObject < argsLength; iObject += 1) {
      var nextSource = arguments[iObject];
      if (!_isNone(nextSource)) {
        _objectOwnKeysForEach(nextSource, function (key) {
          if (Object.getOwnPropertyDescriptor) {
            var desc = Object.getOwnPropertyDescriptor(nextSource, key);
            if (desc.get || desc.set) {
              if (desc.get) {
                desc.get = _bind(desc.get, to);
              }
              if (desc.set) {
                desc.set = _bind(desc.set, to);
              }
            } else if (_isFunction(desc.value)) {
              desc.value = _bind(desc.value, to);
            }
            Object.defineProperty(to, key, _objectAssign({}, desc));
          } else if (_isFunction(nextSource[key])) {
            to[key] = _bind(nextSource[key], to);
          } else {
            to[key] = nextSource[key];
          }
        });
      }
    }
    return to;
  }
  _AwextLib_.objectBindProps = _objectBindProps;

  function _parsePath(path, separator) {
    if (!_isString(separator)) throw new Error('The second parameter \'separator\' must be specified as a string!');
    if (_isArray(path)) return path;
    if (_isNone(path)) return [];
    if (_isRegExp(path)) return [path];
    path += '';
    if (!path) return [];
    if (path[0] === '[' && path[1] === '"') {
      var pathStrLen = path.length;
      if (path[pathStrLen - 2] === '"' && path[pathStrLen - 1] === ']') {
        try {
          return JSON.parse(path);
        } catch (error) {
          // oops, no json
        }
      }
    }
    return path.split(separator);
  }
  _AwextLib_.parsePath = _parsePath;

  function _pathStatus(argVar, path) {
    var currentPathObject = argVar || {};
    for (var idx = 0; idx < path.length; idx += 1) {
      var key = path[idx];
      if (_hasKey(currentPathObject, key)) {
        currentPathObject = currentPathObject[key];
      } else {
        return { exists: false };
      }
    }
    return { exists: true, value: currentPathObject };
  }
  _AwextLib_.pathStatus = _pathStatus;

  function _pathGetter(argVar, path) {
    return _pathStatus(argVar, path).value;
  }
  _AwextLib_.pathGetter = _pathGetter;

  function _pathSetter(rootVar, path, value, onlyWhenParentExists) {
    rootVar = rootVar || {};
    var currentVar = rootVar;
    var parentVar = rootVar;
    var key;
    for (var idx = 0; idx < path.length; idx += 1) {
      key = path[idx];
      if (!_hasKey(currentVar, key) || _isNone(currentVar[key])) {
        if (onlyWhenParentExists) {
          throw new Error('Parent node ' + key + ' does not exist');
        } else {
          currentVar[key] = {};
        }
      }
      parentVar = currentVar;
      currentVar = currentVar[key];
    }
    parentVar[key] = value;
    return rootVar;
  }
  _AwextLib_.pathSetter = _pathSetter;

  function _pathDeleter(argVar, path) {
    var rootVar = argVar || {};
    var currentVar = rootVar;
    var parentVar = currentVar;
    var key;
    for (var idx = 0; idx < path.length; idx += 1) {
      key = path[idx];
      if (!_hasOwn(currentVar, key)) {
        return rootVar;
      }
      parentVar = currentVar;
      currentVar = currentVar[key];
    }
    delete parentVar[key];
    return rootVar;
  }
  _AwextLib_.pathDeleter = _pathDeleter;

  function _isSameArray(pattern, input) {
    if (pattern.length !== input.length) return false;
    for (var idx = 0; idx < pattern.length; idx += 1) {
      var patternCurr = pattern[idx];
      var inputCurr = input[idx];
      if (_isRegExp(patternCurr)) {
        if (!patternCurr.test(inputCurr)) {
          return false;
        }
      } else if (patternCurr + '' !== inputCurr + '') {
        return false;
      }
    }
    return true;
  }

  function _isBeforeOrSameArray(pattern, input) {
    if (pattern.length < input.length) return false;
    for (var idx = 0; idx < input.length; idx += 1) {
      var patternCurr = pattern[idx];
      var inputCurr = input[idx];
      if (_isRegExp(patternCurr)) {
        if (!patternCurr.test(inputCurr)) {
          return false;
        }
      } else if (patternCurr + '' !== inputCurr + '') {
        return false;
      }
    }
    return true;
  }

  function _isBeforeArray(pattern, input) {
    if (pattern.length <= input.length) return false;
    for (var idx = 0; idx < input.length; idx += 1) {
      var patternCurr = pattern[idx];
      var inputCurr = input[idx];
      if (_isRegExp(patternCurr)) {
        if (!patternCurr.test(inputCurr)) {
          return false;
        }
      } else if (patternCurr + '' !== inputCurr + '') {
        return false;
      }
    }
    return true;
  }

  function _isAfterOrSameArray(pattern, input) {
    if (pattern.length > input.length) return false;
    for (var idx = 0; idx < pattern.length; idx += 1) {
      var patternCurr = pattern[idx];
      var inputCurr = input[idx];
      if (_isRegExp(patternCurr)) {
        if (!patternCurr.test(inputCurr)) {
          return false;
        }
      } else if (patternCurr + '' !== inputCurr + '') {
        return false;
      }
    }
    return true;
  }

  function _isAfterArray(pattern, input) {
    if (pattern.length >= input.length) return false;
    for (var idx = 0; idx < pattern.length; idx += 1) {
      var patternCurr = pattern[idx];
      var inputCurr = input[idx];
      if (_isRegExp(patternCurr)) {
        if (!patternCurr.test(inputCurr)) {
          return false;
        }
      } else if (patternCurr + '' !== inputCurr + '') {
        return false;
      }
    }
    return true;
  }

  function _isAwextPackage(awextStore) {
    return awextStore
    && awextStore.awextFunctions
    && awextStore.awextFunctions.awextGetName
    && awextStore.baseObject;
  }

  // awext definition begin
  var Store__AwextInstance = {};
  var Store__UnwatchId = {};
  var Counter__UnwatchId = 0;

  function _getAwextPackage(awextName) {
    if (!awextName) throw new Error('Awext name must be provided');
    awextName = _parsePath(awextName, '/');
    var existingAwext = _pathGetter(Store__AwextInstance, awextName);
    if (_isAwextPackage(existingAwext)) {
      return existingAwext;
    }
    return null;
  }

  deps_Statecore = _objectAssign({}, deps_Statecore);

  // lib funcions start
  var Counter__AwextName = 0;
  function createAwext(createAwextOpt, initArg) {
    createAwextOpt = createAwextOpt || {};
    if (_isString(createAwextOpt) || _isNumber(createAwextOpt) || _isArray(createAwextOpt)) {
      createAwextOpt = { awextName: createAwextOpt };
    }
    var awextName = _parsePath(createAwextOpt.awextName, '/');
    if (awextName.length > 0) {
      var existingAwext = _getAwextPackage(awextName);
      if (existingAwext) {
        return existingAwext.baseObject;
      }
    } else {
      Counter__AwextName += 1;
      awextName = ['__unnamed_awext__', Counter__AwextName + '__' + _genUUID()];
    }
    var __pathSeperator = createAwextOpt.pathSeperator || '.';
    var __destroyFunc = null;
    var __INNER_EVENT_NAMESPACE = _genUUID();
    var __statecoreInstance = deps_Statecore.createStatecore({});
    var __initFunction = _isFunction(initArg) ? initArg : null;
    var __initObject = _isKeyValueObject(initArg) ? _objectAssign({}, initArg) : null;
    var __unwatcherDefaultNS = 'default_ns__' + _genUUID();
    var __unwatchers = {};
    var __awextThis = {};
    _objectAssign(__awextThis, {
      // statecoreNotifyAllObservers: __statecoreInstance.statecoreNotifyAllObservers,
      // statecoreAddObserver: __statecoreInstance.statecoreAddObserver,
      // statecoreDiscard: __statecoreInstance.statecoreDiscard,
      // statecoreIsDiscarded: __statecoreInstance.statecoreIsDiscarded,
      // statecoreGetState: __statecoreInstance.statecoreGetState,
      // statecoreSetState: __statecoreInstance.statecoreSetState,

      awextName: _objectAssign([], awextName),
      awextGetName: function () {
        return _objectAssign([], awextName);
      },
      awextClone: function () {
        return _objectAssign(
          {},
          __awextThis,
          { awextName: __awextThis.awextGetName() },
        );
      },
      awextIsDiscarded: __statecoreInstance.statecoreIsDiscarded,
      awextDiscard: function () {
        if (__awextThis.awextIsDiscarded()) {
          console.warn('Attempt to discard a discarded awext instance under path: ' + __awextThis.awextName.join('/'));
          return;
        }
        if (_isFunction(__destroyFunc)) {
          __destroyFunc();
        }
        if (__initObject) {
          _objectOwnKeysForEach(__initObject, function (key) {
            delete __initObject[key];
          });
        }
        _pathDeleter(Store__AwextInstance, __awextThis.awextGetName());
        __awextThis.awextEmit(__INNER_EVENT_NAMESPACE, {
          action: 'discard',
          method: 'awextDiscard',
        });
        __awextThis.awextUnwatchAll();
        __statecoreInstance.statecoreDiscard();
      },

      awextRegisterUnwatch: function (argUnwatchFunctions) {
        if (arguments.length > 1) throw new Error('The second argument are not allowed to be specified!');
        return __awextThis.awextRegisterUnwatchWithNS(__unwatcherDefaultNS, argUnwatchFunctions);
      },
      awextRegisterUnwatchWithNS: function (ns, argUnwatchFunctions) {
        if (!_isString(ns) || !ns) throw new Error('The first argument: namespace must be specified in a String!');
        __unwatchers[ns] = __unwatchers[ns] || [];
        if (!_isArray(argUnwatchFunctions)) {
          argUnwatchFunctions = [argUnwatchFunctions];
        }
        var allUnwatchFunctions = [];
        _objectOwnKeysForEach(argUnwatchFunctions, function (key) {
          var _currentFunc = argUnwatchFunctions[key];
          if (!_isFunction(_currentFunc)) {
            throw new Error('Only a function can be registered into the unwatch manager!');
          }
          allUnwatchFunctions.push(_currentFunc);
        });
        var unwatchFunction = function () {
          if (!allUnwatchFunctions) return;
          while (allUnwatchFunctions.length > 0) allUnwatchFunctions.pop()();
          allUnwatchFunctions = null;
        };
        __unwatchers[ns].push(unwatchFunction);
        return unwatchFunction;
      },

      awextEmit: __statecoreInstance.statecoreNotifyAllObservers,
      awextOn: function (eventName, func) {
        if (!_isFunction(func)) throw new Error('Listener must be a function!');
        return __awextThis.awextRegisterUnwatch(
          __statecoreInstance.statecoreAddObserver(function (emitEventName) {
            if (emitEventName === eventName) {
              func.apply(__awextThis, arguments);
            }
          }),
        );
      },

      awextGet: __statecoreInstance.statecoreGetState,
      awextSet: function (value) {
        return __awextThis.awextUpdate(function () {
          return { value: value };
        });
      },
      awextGetPath: function (path) {
        if (arguments.length === 0) {
          return __awextThis.awextGet();
        }
        path = _parsePath(path, __pathSeperator);
        return _pathGetter(__awextThis.awextGet(), path);
      },
      awextSetPath: function (path, value, _opts) {
        return __awextThis.awextUpdatePath(_parsePath(path, __pathSeperator), function () {
          return { value: value };
        }, _opts);
      },
      awextSetManyPaths: function (values, basePath) {
        basePath = _parsePath(basePath, __pathSeperator);
        if (_isArray(values)) {
          // [{key1: value1, key2: value2}]
          _objectOwnKeysForEach(values, function (idx) {
            __awextThis.awextSetManyPaths(values[idx], basePath);
          });
        } else {
          // {key1: value1, key2: value2}
          _objectOwnKeysForEach(values, function (key) {
            var subPath = _parsePath(key, __pathSeperator);
            __awextThis.awextSetPath([].concat(basePath, subPath), values[key]);
          });
        }
      },
      awextReset: function () {
        if (_isFunction(__destroyFunc)) {
          __destroyFunc();
        }
        if (__initFunction) {
          __destroyFunc = __initFunction(__awextThis.awextClone());
          return null;
        } else if (__initObject) {
          return __awextThis.awextReplace(_objectAssign({}, __initObject));
        } else {
          throw new Error('No init argument is provided, cannot reset it.');
        }
      },
      awextResetPath: function (path, _opts) {
        if (__initFunction) throw new Error('Init argument is not an object, could not find a path in it.');
        _opts = Object(_opts || {});
        path = _parsePath(path, __pathSeperator);
        var pathInfo = _pathStatus(__initObject, path);
        if (pathInfo.exists) {
          return __awextThis.awextSetPath(path, pathInfo.value, _opts);
        } else {
          return __awextThis.awextRemovePath(path, _opts);
        }
      },
      awextReplace: function (newState, _opts) {
        _opts = Object(_opts || {});
        var currentState = __awextThis.awextGet();
        _objectOwnKeysForEach(currentState, function (path) {
          if (!_hasOwn(newState, path)) {
            __awextThis.awextRemovePath(path, _opts);
          }
        });
        return __awextThis.awextSetManyPaths(_objectAssign({}, newState), _opts);
      },
      awextHasPath: function (path) {
        path = _parsePath(path, __pathSeperator);
        return !!_pathStatus(__awextThis.awextGet(), path).exists;
      },

      awextUpdate: function (updater, _opts) {
        _opts = Object(_opts || {});
        var oldState = __statecoreInstance.statecoreGetState();
        var newStateInfo = updater({ value: _objectAssign({}, oldState), exists: true });
        if (!_isKeyValueObject(newStateInfo)) newStateInfo = {};
        var silent = _opts.silent;
        if (_isBoolean(newStateInfo.silent)) {
          silent = newStateInfo.silent;
        }
        var newStateValue = __statecoreInstance.statecoreSetState(newStateInfo.value);
        if (!silent) {
          __awextThis.awextEmit(__INNER_EVENT_NAMESPACE, {
            oldState: oldState,
            newState: newStateValue,
            action: 'update',
            method: 'awextUpdate',
          });
        }
        return newStateValue;
      },
      awextUpdatePath: function (path, updater, _opts) {
        _opts = Object(_opts || {});
        path = _parsePath(path, __pathSeperator);
        var oldRootState = __statecoreInstance.statecoreGetState();
        var oldRathStateInfo = _pathStatus(oldRootState, path);
        var oldPathState = oldRathStateInfo.value;
        var newPathStateInfo = updater(oldRathStateInfo);
        if (!_isKeyValueObject(newPathStateInfo)) newPathStateInfo = {};
        var silent = newPathStateInfo.silent || _opts.silent;
        var newPathState = newPathStateInfo.value;
        var eventAction;
        var newRootState;
        // delete
        if (newPathState === undefined) {
          newRootState = _pathDeleter(_objectAssign({}, oldRootState), path);
          eventAction = 'delete';
        } else { // update
          newRootState = _pathSetter(_objectAssign({}, oldRootState), path, newPathState, _opts.onlyWhenParentExists);
          eventAction = 'update';
        }
        __statecoreInstance.statecoreSetState(newRootState);
        if (!silent) {
          __awextThis.awextEmit(__INNER_EVENT_NAMESPACE, {
            path: path,
            oldPathState: oldPathState,
            oldPathStateExists: oldRathStateInfo.exists,
            newPathState: newPathState,
            action: eventAction,
            method: 'awextUpdatePath',
          });
        }
        return newPathState;
      },

      awextRemovePath: function (path, _opts) {
        _opts = Object(_opts || {});
        path = _parsePath(path, __pathSeperator);
        var oldPathState;
        var newRootState = __awextThis.awextUpdatePath(path, function (oldPathInfo) {
          oldPathState = oldPathInfo.value;
          return { exists: false };
        }, { silent: true });
        if (!_opts.silent) {
          __awextThis.awextEmit(__INNER_EVENT_NAMESPACE, {
            path: path,
            oldPathState: oldPathState,
            action: 'delete',
            method: 'awextRemovePath',
          });
        }
        return newRootState;
      },

      awextCreateUnwatchId: function (cb) {
        if (!_isFunction(cb)) {
          throw new Error('Only a function can be used for creating a watch id!');
        }
        Counter__UnwatchId += 1;
        Store__UnwatchId[Counter__UnwatchId] = cb;
        return Counter__UnwatchId;
      },
      awextUnwatchById: function (id) {
        var unwatchFunc = Store__UnwatchId[id];
        if (_isFunction(unwatchFunc)) {
          delete Store__UnwatchId[id];
          unwatchFunc();
        }
      },

      awextWatch: function (cb) {
        return __awextThis.awextOn(__INNER_EVENT_NAMESPACE, function (eventName, eventObject) {
          cb(undefined, eventObject);
        });
      },

      awextWatchPath: function (watchPath, cb) {
        watchPath = _parsePath(watchPath, __pathSeperator);
        return __awextThis.awextWatch(function (eventType, awextEvent) {
          var path = _parsePath(awextEvent.path, __pathSeperator);
          if (_isSameArray(watchPath, path)) {
            cb.apply(__awextThis, arguments);
          }
        });
      },

      awextWatchPathAfter: function (matchPath, cb) {
        matchPath = _parsePath(matchPath, __pathSeperator);
        return __awextThis.awextWatch(function (eventType, awextEvent) {
          var path = _parsePath(awextEvent.path, __pathSeperator);
          if (_isAfterArray(matchPath, path)) {
            cb.apply(__awextThis, arguments);
          }
        });
      },
      awextWatchPathSameOrAfter: function (matchPath, cb) {
        matchPath = _parsePath(matchPath, __pathSeperator);
        return __awextThis.awextWatch(function (eventType, awextEvent) {
          var path = _parsePath(awextEvent.path, __pathSeperator);
          if (_isAfterOrSameArray(matchPath, path)) {
            cb.apply(__awextThis, arguments);
          }
        });
      },
      awextWatchPathBefore: function (matchPath, cb) {
        matchPath = _parsePath(matchPath, __pathSeperator);
        return __awextThis.awextWatch(function (eventType, awextEvent) {
          var path = _parsePath(awextEvent.path, __pathSeperator);
          if (_isBeforeArray(matchPath, path)) {
            cb.apply(__awextThis, arguments);
          }
        });
      },
      awextWatchPathSameOrBefore: function (matchPath, cb) {
        matchPath = _parsePath(matchPath, __pathSeperator);
        return __awextThis.awextWatch(function (eventType, awextEvent) {
          var path = _parsePath(awextEvent.path, __pathSeperator);
          if (_isBeforeOrSameArray(matchPath, path)) {
            cb.apply(__awextThis, arguments);
          }
        });
      },

      awextUnwatchAll: function () {
        if (arguments.length > 0) throw new Error('awextUnwatchAll() does not accept any argument, instead, you can use awextUnwatchWithNS(namespace)');
        _objectOwnKeysForEach(__unwatchers, function (ns) {
          __awextThis.awextUnwatchWithNS(ns);
        });
      },
      awextUnwatchWithNS: function (ns) {
        ns = ns || __unwatcherDefaultNS;
        var unwatchersNS = __unwatchers[ns] || [];
        while (unwatchersNS.length > 0) unwatchersNS.shift()();
      },
      awextUnwatchWithNamespace: function (ns) {
        return __awextThis.awextUnwatchWithNS(ns);
      },
    });
    if (createAwextOpt.unmanageable !== true) { // it means that it is a manageable awext
      _pathSetter(Store__AwextInstance, __awextThis.awextGetName(), {
        awextFunctions: __awextThis.awextClone(),
        baseObject: __awextThis.awextClone(),
      });
    }
    // init at the last step
    if (__initFunction) {
      __destroyFunc = __initFunction(__awextThis.awextClone());
    } else if (__initObject) {
      __awextThis.awextSetManyPaths(_objectAssign({}, __initObject));
    }
    return __awextThis.awextClone();
  }
  _AwextLib_.createAwext = createAwext;

  function hasAwext(awextName) {
    awextName = _parsePath(awextName, '/');
    return _isAwextPackage(_pathGetter(Store__AwextInstance, awextName));
  }
  _AwextLib_.hasAwext = hasAwext;

  function getAwextFunctions(awextName) {
    if (!awextName) throw new Error('Awext name must be provided');
    awextName = _parsePath(awextName, '/');
    var existingAwext = _pathGetter(Store__AwextInstance, awextName);
    if (_isAwextPackage(existingAwext)) {
      return existingAwext.awextFunctions.awextClone();
    }
    return null;
  }
  _AwextLib_.getAwextFunctions = getAwextFunctions;

  function getAllAwexts() {
    return _objectAssign({}, Store__AwextInstance);
  }
  _AwextLib_.getAllAwexts = getAllAwexts;

  function getAwext(awextName) {
    if (!awextName) throw new Error('Awext name must be provided');
    awextName = _parsePath(awextName, '/');
    var existingAwext = _pathGetter(Store__AwextInstance, awextName);
    if (_isAwextPackage(existingAwext)) {
      return existingAwext.baseObject;
    }
    return null;
  }
  _AwextLib_.getAwext = getAwext;

  function rebaseAwext(awextName, base) {
    awextName = _parsePath(awextName, '/');
    var existingAwext = _pathGetter(Store__AwextInstance, awextName);
    if (existingAwext) {
      _objectBindProps(
        base,
        existingAwext.awextFunctions.awextClone(),
      );
      existingAwext.baseObject = base;
      _pathSetter(Store__AwextInstance, awextName, existingAwext);
    } else {
      throw new Error('awext ' + JSON.stringify(awextName) + ' Not found');
    }
    return existingAwext.baseObject;
  }
  _AwextLib_.rebaseAwext = rebaseAwext;

  function discardAwext(awextName) {
    awextName = _parsePath(awextName, '/');
    var instance = _pathGetter(Store__AwextInstance, awextName);
    if (instance) {
      instance.awextFunctions.awextDiscard();
      _pathDeleter(Store__AwextInstance, awextName);
    } else {
      throw new Error('awext ' + JSON.stringify(awextName) + ' Not found');
    }
  }
  _AwextLib_.discardAwext = discardAwext;

  function awextify(awextifyOpt, baseObject, initArg) {
    awextifyOpt = awextifyOpt || {};
    if (_isString(awextifyOpt)) awextifyOpt = { awextName: awextifyOpt };
    awextifyOpt.awextName = _parsePath(awextifyOpt.awextName, '/');
    baseObject = baseObject || {};
    if (awextifyOpt.awextName.length > 0 && hasAwext(awextifyOpt.awextName)) {
      throw new Error('Awext ' + JSON.stringify(awextifyOpt.awextName) + ' has existed!');
    }
    if (awextifyOpt.bindThisToBase) {
      _objectBindProps(baseObject, baseObject); // bind the functions from base to base itself
    }
    var initFuncWhenAwextify = null;
    var initFuncWhenCreateAwext = null;
    var envRef = { initFunc: null, discardFunc: null };
    if (_isFunction(initArg)) {
      initFuncWhenAwextify = function (_thisAwext) {
        envRef.discardFunc = initArg(_thisAwext, baseObject);
      };
      initFuncWhenCreateAwext = function (_thisAwext) {
        if (_isFunction(envRef.initFunc)) {
          envRef.initFunc(_thisAwext);
        }
        return function () {
          if (_isFunction(envRef.discardFunc)) {
            envRef.discardFunc();
          }
        };
      };
    }
    var _awext = createAwext(awextifyOpt, initFuncWhenCreateAwext || initArg);
    _objectBindProps(baseObject, _awext);
    if (initFuncWhenAwextify) {
      initFuncWhenAwextify(_awext);
      envRef.initFunc = initFuncWhenAwextify;
    }

    if (awextifyOpt.awextName.length > 0) {
      // rebase the awext
      return rebaseAwext(
        awextifyOpt.awextName,
        baseObject,
      );
    }
    return baseObject;
  }
  _AwextLib_.awextify = awextify;

  return _objectAssign({}, _AwextLib_);
}));
