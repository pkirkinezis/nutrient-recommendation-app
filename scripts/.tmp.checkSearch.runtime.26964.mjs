var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/react/cjs/react.production.js
var require_react_production = __commonJS({
  "node_modules/react/cjs/react.production.js"(exports) {
    "use strict";
    var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
    var REACT_MEMO_TYPE = Symbol.for("react.memo");
    var REACT_LAZY_TYPE = Symbol.for("react.lazy");
    var REACT_ACTIVITY_TYPE = Symbol.for("react.activity");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var ReactNoopUpdateQueue = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    };
    var assign = Object.assign;
    var emptyObject = {};
    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    Component.prototype.isReactComponent = {};
    Component.prototype.setState = function(partialState, callback) {
      if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, partialState, callback, "setState");
    };
    Component.prototype.forceUpdate = function(callback) {
      this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
    };
    function ComponentDummy() {
    }
    ComponentDummy.prototype = Component.prototype;
    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent;
    assign(pureComponentPrototype, Component.prototype);
    pureComponentPrototype.isPureReactComponent = true;
    var isArrayImpl = Array.isArray;
    function noop() {
    }
    var ReactSharedInternals = { H: null, A: null, T: null, S: null };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function ReactElement(type, key, props) {
      var refProp = props.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== refProp ? refProp : null,
        props
      };
    }
    function cloneAndReplaceKey(oldElement, newKey) {
      return ReactElement(oldElement.type, newKey, oldElement.props);
    }
    function isValidElement(object) {
      return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function escape(key) {
      var escaperLookup = { "=": "=0", ":": "=2" };
      return "$" + key.replace(/[=:]/g, function(match) {
        return escaperLookup[match];
      });
    }
    var userProvidedKeyEscapeRegex = /\/+/g;
    function getElementKey(element, index) {
      return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
    }
    function resolveThenable(thenable) {
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
            function(fulfilledValue) {
              "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
            },
            function(error) {
              "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            }
          )), thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
      }
      throw thenable;
    }
    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
      var type = typeof children;
      if ("undefined" === type || "boolean" === type) children = null;
      var invokeCallback = false;
      if (null === children) invokeCallback = true;
      else
        switch (type) {
          case "bigint":
          case "string":
          case "number":
            invokeCallback = true;
            break;
          case "object":
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
                break;
              case REACT_LAZY_TYPE:
                return invokeCallback = children._init, mapIntoArray(
                  invokeCallback(children._payload),
                  array,
                  escapedPrefix,
                  nameSoFar,
                  callback
                );
            }
        }
      if (invokeCallback)
        return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
          return c;
        })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
          callback,
          escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
            userProvidedKeyEscapeRegex,
            "$&/"
          ) + "/") + invokeCallback
        )), array.push(callback)), 1;
      invokeCallback = 0;
      var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
      if (isArrayImpl(children))
        for (var i = 0; i < children.length; i++)
          nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if (i = getIteratorFn(children), "function" === typeof i)
        for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
          nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if ("object" === type) {
        if ("function" === typeof children.then)
          return mapIntoArray(
            resolveThenable(children),
            array,
            escapedPrefix,
            nameSoFar,
            callback
          );
        array = String(children);
        throw Error(
          "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
        );
      }
      return invokeCallback;
    }
    function mapChildren(children, func, context) {
      if (null == children) return children;
      var result = [], count = 0;
      mapIntoArray(children, result, "", "", function(child) {
        return func.call(context, child, count++);
      });
      return result;
    }
    function lazyInitializer(payload) {
      if (-1 === payload._status) {
        var ctor = payload._result;
        ctor = ctor();
        ctor.then(
          function(moduleObject) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 1, payload._result = moduleObject;
          },
          function(error) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 2, payload._result = error;
          }
        );
        -1 === payload._status && (payload._status = 0, payload._result = ctor);
      }
      if (1 === payload._status) return payload._result.default;
      throw payload._result;
    }
    var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var event = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
          error
        });
        if (!window.dispatchEvent(event)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", error);
        return;
      }
      console.error(error);
    };
    var Children = {
      map: mapChildren,
      forEach: function(children, forEachFunc, forEachContext) {
        mapChildren(
          children,
          function() {
            forEachFunc.apply(this, arguments);
          },
          forEachContext
        );
      },
      count: function(children) {
        var n = 0;
        mapChildren(children, function() {
          n++;
        });
        return n;
      },
      toArray: function(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      },
      only: function(children) {
        if (!isValidElement(children))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return children;
      }
    };
    exports.Activity = REACT_ACTIVITY_TYPE;
    exports.Children = Children;
    exports.Component = Component;
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.Profiler = REACT_PROFILER_TYPE;
    exports.PureComponent = PureComponent;
    exports.StrictMode = REACT_STRICT_MODE_TYPE;
    exports.Suspense = REACT_SUSPENSE_TYPE;
    exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
    exports.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(size) {
        return ReactSharedInternals.H.useMemoCache(size);
      }
    };
    exports.cache = function(fn) {
      return function() {
        return fn.apply(null, arguments);
      };
    };
    exports.cacheSignal = function() {
      return null;
    };
    exports.cloneElement = function(element, config, children) {
      if (null === element || void 0 === element)
        throw Error(
          "The argument must be a React element, but you passed " + element + "."
        );
      var props = assign({}, element.props), key = element.key;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
      var propName = arguments.length - 2;
      if (1 === propName) props.children = children;
      else if (1 < propName) {
        for (var childArray = Array(propName), i = 0; i < propName; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      return ReactElement(element.type, key, props);
    };
    exports.createContext = function(defaultValue) {
      defaultValue = {
        $$typeof: REACT_CONTEXT_TYPE,
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      };
      defaultValue.Provider = defaultValue;
      defaultValue.Consumer = {
        $$typeof: REACT_CONSUMER_TYPE,
        _context: defaultValue
      };
      return defaultValue;
    };
    exports.createElement = function(type, config, children) {
      var propName, props = {}, key = null;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
      var childrenLength = arguments.length - 2;
      if (1 === childrenLength) props.children = children;
      else if (1 < childrenLength) {
        for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      if (type && type.defaultProps)
        for (propName in childrenLength = type.defaultProps, childrenLength)
          void 0 === props[propName] && (props[propName] = childrenLength[propName]);
      return ReactElement(type, key, props);
    };
    exports.createRef = function() {
      return { current: null };
    };
    exports.forwardRef = function(render) {
      return { $$typeof: REACT_FORWARD_REF_TYPE, render };
    };
    exports.isValidElement = isValidElement;
    exports.lazy = function(ctor) {
      return {
        $$typeof: REACT_LAZY_TYPE,
        _payload: { _status: -1, _result: ctor },
        _init: lazyInitializer
      };
    };
    exports.memo = function(type, compare) {
      return {
        $$typeof: REACT_MEMO_TYPE,
        type,
        compare: void 0 === compare ? null : compare
      };
    };
    exports.startTransition = function(scope) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
      } catch (error) {
        reportGlobalError(error);
      } finally {
        null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    };
    exports.unstable_useCacheRefresh = function() {
      return ReactSharedInternals.H.useCacheRefresh();
    };
    exports.use = function(usable) {
      return ReactSharedInternals.H.use(usable);
    };
    exports.useActionState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useActionState(action, initialState, permalink);
    };
    exports.useCallback = function(callback, deps) {
      return ReactSharedInternals.H.useCallback(callback, deps);
    };
    exports.useContext = function(Context) {
      return ReactSharedInternals.H.useContext(Context);
    };
    exports.useDebugValue = function() {
    };
    exports.useDeferredValue = function(value, initialValue) {
      return ReactSharedInternals.H.useDeferredValue(value, initialValue);
    };
    exports.useEffect = function(create, deps) {
      return ReactSharedInternals.H.useEffect(create, deps);
    };
    exports.useEffectEvent = function(callback) {
      return ReactSharedInternals.H.useEffectEvent(callback);
    };
    exports.useId = function() {
      return ReactSharedInternals.H.useId();
    };
    exports.useImperativeHandle = function(ref, create, deps) {
      return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
    };
    exports.useInsertionEffect = function(create, deps) {
      return ReactSharedInternals.H.useInsertionEffect(create, deps);
    };
    exports.useLayoutEffect = function(create, deps) {
      return ReactSharedInternals.H.useLayoutEffect(create, deps);
    };
    exports.useMemo = function(create, deps) {
      return ReactSharedInternals.H.useMemo(create, deps);
    };
    exports.useOptimistic = function(passthrough, reducer) {
      return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
    };
    exports.useReducer = function(reducer, initialArg, init) {
      return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
    };
    exports.useRef = function(initialValue) {
      return ReactSharedInternals.H.useRef(initialValue);
    };
    exports.useState = function(initialState) {
      return ReactSharedInternals.H.useState(initialState);
    };
    exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
      return ReactSharedInternals.H.useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
      );
    };
    exports.useTransition = function() {
      return ReactSharedInternals.H.useTransition();
    };
    exports.version = "19.2.3";
  }
});

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/react/cjs/react.development.js"(exports, module) {
    "use strict";
    "production" !== process.env.NODE_ENV && (function() {
      function defineDeprecationWarning(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              info[0],
              info[1]
            );
          }
        });
      }
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable)
          return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      function warnNoop(publicInstance, callerName) {
        publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
        var warningKey = publicInstance + "." + callerName;
        didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          callerName,
          publicInstance
        ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
      }
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function ComponentDummy() {
      }
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function noop() {
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        newKey = ReactElement(
          oldElement.type,
          newKey,
          oldElement.props,
          oldElement._owner,
          oldElement._debugStack,
          oldElement._debugTask
        );
        oldElement._store && (newKey._store.validated = oldElement._store.validated);
        return newKey;
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback) {
          invokeCallback = children;
          callback = callback(invokeCallback);
          var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
          isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + childKey
          ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
          return 1;
        }
        invokeCallback = 0;
        childKey = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (i === children.entries && (didWarnAboutMaps || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var ioInfo = payload._ioInfo;
          null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
          ioInfo = payload._result;
          var thenable = ioInfo();
          thenable.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 1;
                payload._result = moduleObject;
                var _ioInfo = payload._ioInfo;
                null != _ioInfo && (_ioInfo.end = performance.now());
                void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
              }
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 2;
                payload._result = error;
                var _ioInfo2 = payload._ioInfo;
                null != _ioInfo2 && (_ioInfo2.end = performance.now());
                void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            }
          );
          ioInfo = payload._ioInfo;
          if (null != ioInfo) {
            ioInfo.value = thenable;
            var displayName = thenable.displayName;
            "string" === typeof displayName && (ioInfo.name = displayName);
          }
          -1 === payload._status && (payload._status = 0, payload._result = thenable);
        }
        if (1 === payload._status)
          return ioInfo = payload._result, void 0 === ioInfo && console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
            ioInfo
          ), "default" in ioInfo || console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
            ioInfo
          ), ioInfo.default;
        throw payload._result;
      }
      function resolveDispatcher() {
        var dispatcher = ReactSharedInternals.H;
        null === dispatcher && console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
        return dispatcher;
      }
      function releaseAsyncTransition() {
        ReactSharedInternals.asyncTransitions--;
      }
      function enqueueTask(task) {
        if (null === enqueueTaskImpl)
          try {
            var requireString = ("require" + Math.random()).slice(0, 7);
            enqueueTaskImpl = (module && module[requireString]).call(
              module,
              "timers"
            ).setImmediate;
          } catch (_err) {
            enqueueTaskImpl = function(callback) {
              false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var channel = new MessageChannel();
              channel.port1.onmessage = callback;
              channel.port2.postMessage(void 0);
            };
          }
        return enqueueTaskImpl(task);
      }
      function aggregateErrors(errors) {
        return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
      }
      function popActScope(prevActQueue, prevActScopeDepth) {
        prevActScopeDepth !== actScopeDepth - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        );
        actScopeDepth = prevActScopeDepth;
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
        var queue = ReactSharedInternals.actQueue;
        if (null !== queue)
          if (0 !== queue.length)
            try {
              flushActQueue(queue);
              enqueueTask(function() {
                return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
              });
              return;
            } catch (error) {
              ReactSharedInternals.thrownErrors.push(error);
            }
          else ReactSharedInternals.actQueue = null;
        0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
      }
      function flushActQueue(queue) {
        if (!isFlushing) {
          isFlushing = true;
          var i = 0;
          try {
            for (; i < queue.length; i++) {
              var callback = queue[i];
              do {
                ReactSharedInternals.didUsePromise = false;
                var continuation = callback(false);
                if (null !== continuation) {
                  if (ReactSharedInternals.didUsePromise) {
                    queue[i] = callback;
                    queue.splice(0, i);
                    return;
                  }
                  callback = continuation;
                } else break;
              } while (1);
            }
            queue.length = 0;
          } catch (error) {
            queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
          } finally {
            isFlushing = false;
          }
        }
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function(publicInstance) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance) {
          warnNoop(publicInstance, "setState");
        }
      }, assign = Object.assign, emptyObject = {};
      Object.freeze(emptyObject);
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      var deprecatedAPIs = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      };
      for (fnName in deprecatedAPIs)
        deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      ComponentDummy.prototype = Component.prototype;
      deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
      deprecatedAPIs.constructor = PureComponent;
      assign(deprecatedAPIs, Component.prototype);
      deprecatedAPIs.isPureReactComponent = true;
      var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        asyncTransitions: 0,
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false,
        didUsePromise: false,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      deprecatedAPIs = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
        deprecatedAPIs,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
        queueMicrotask(function() {
          return queueMicrotask(callback);
        });
      } : enqueueTask;
      deprecatedAPIs = Object.freeze({
        __proto__: null,
        c: function(size) {
          return resolveDispatcher().useMemoCache(size);
        }
      });
      var fnName = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports.Activity = REACT_ACTIVITY_TYPE;
      exports.Children = fnName;
      exports.Component = Component;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports.__COMPILER_RUNTIME = deprecatedAPIs;
      exports.act = function(callback) {
        var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
        actScopeDepth++;
        var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
        try {
          var result = callback();
        } catch (error) {
          ReactSharedInternals.thrownErrors.push(error);
        }
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        if (null !== result && "object" === typeof result && "function" === typeof result.then) {
          var thenable = result;
          queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          });
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              thenable.then(
                function(returnValue) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  if (0 === prevActScopeDepth) {
                    try {
                      flushActQueue(queue), enqueueTask(function() {
                        return recursivelyFlushAsyncActWork(
                          returnValue,
                          resolve,
                          reject
                        );
                      });
                    } catch (error$0) {
                      ReactSharedInternals.thrownErrors.push(error$0);
                    }
                    if (0 < ReactSharedInternals.thrownErrors.length) {
                      var _thrownError = aggregateErrors(
                        ReactSharedInternals.thrownErrors
                      );
                      ReactSharedInternals.thrownErrors.length = 0;
                      reject(_thrownError);
                    }
                  } else resolve(returnValue);
                },
                function(error) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                    ReactSharedInternals.thrownErrors
                  ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                }
              );
            }
          };
        }
        var returnValue$jscomp$0 = result;
        popActScope(prevActQueue, prevActScopeDepth);
        0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
          didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), ReactSharedInternals.actQueue = null);
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        return {
          then: function(resolve, reject) {
            didAwaitActCall = true;
            0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
              return recursivelyFlushAsyncActWork(
                returnValue$jscomp$0,
                resolve,
                reject
              );
            })) : resolve(returnValue$jscomp$0);
          }
        };
      };
      exports.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports.cacheSignal = function() {
        return null;
      };
      exports.captureOwnerStack = function() {
        var getCurrentStack = ReactSharedInternals.getCurrentStack;
        return null === getCurrentStack ? null : getCurrentStack();
      };
      exports.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key, owner = element._owner;
        if (null != config) {
          var JSCompiler_inline_result;
          a: {
            if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
              config,
              "ref"
            ).get) && JSCompiler_inline_result.isReactWarning) {
              JSCompiler_inline_result = false;
              break a;
            }
            JSCompiler_inline_result = void 0 !== config.ref;
          }
          JSCompiler_inline_result && (owner = getOwner());
          hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
          for (propName in config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        }
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          JSCompiler_inline_result = Array(propName);
          for (var i = 0; i < propName; i++)
            JSCompiler_inline_result[i] = arguments[i + 2];
          props.children = JSCompiler_inline_result;
        }
        props = ReactElement(
          element.type,
          key,
          props,
          owner,
          element._debugStack,
          element._debugTask
        );
        for (key = 2; key < arguments.length; key++)
          validateChildKeys(arguments[key]);
        return props;
      };
      exports.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        defaultValue._currentRenderer = null;
        defaultValue._currentRenderer2 = null;
        return defaultValue;
      };
      exports.createElement = function(type, config, children) {
        for (var i = 2; i < arguments.length; i++)
          validateChildKeys(arguments[i]);
        i = {};
        var key = null;
        if (null != config)
          for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) i.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
            childArray[_i] = arguments[_i + 2];
          Object.freeze && Object.freeze(childArray);
          i.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === i[propName] && (i[propName] = childrenLength[propName]);
        key && defineKeyPropWarningGetter(
          i,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return ReactElement(
          type,
          key,
          i,
          getOwner(),
          propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.createRef = function() {
        var refObject = { current: null };
        Object.seal(refObject);
        return refObject;
      };
      exports.forwardRef = function(render) {
        null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : "function" !== typeof render ? console.error(
          "forwardRef requires a render function but was given %s.",
          null === render ? "null" : typeof render
        ) : 0 !== render.length && 2 !== render.length && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        );
        null != render && null != render.defaultProps && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
        Object.defineProperty(elementType, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
          }
        });
        return elementType;
      };
      exports.isValidElement = isValidElement;
      exports.lazy = function(ctor) {
        ctor = { _status: -1, _result: ctor };
        var lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: ctor,
          _init: lazyInitializer
        }, ioInfo = {
          name: "lazy",
          start: -1,
          end: -1,
          value: null,
          owner: null,
          debugStack: Error("react-stack-top-frame"),
          debugTask: console.createTask ? console.createTask("lazy()") : null
        };
        ctor._ioInfo = ioInfo;
        lazyType._debugInfo = [{ awaited: ioInfo }];
        return lazyType;
      };
      exports.memo = function(type, compare) {
        null == type && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          null === type ? "null" : typeof type
        );
        compare = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
        var ownName;
        Object.defineProperty(compare, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
          }
        });
        return compare;
      };
      exports.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        currentTransition._updatedFibers = /* @__PURE__ */ new Set();
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      };
      exports.unstable_useCacheRefresh = function() {
        return resolveDispatcher().useCacheRefresh();
      };
      exports.use = function(usable) {
        return resolveDispatcher().use(usable);
      };
      exports.useActionState = function(action, initialState, permalink) {
        return resolveDispatcher().useActionState(
          action,
          initialState,
          permalink
        );
      };
      exports.useCallback = function(callback, deps) {
        return resolveDispatcher().useCallback(callback, deps);
      };
      exports.useContext = function(Context) {
        var dispatcher = resolveDispatcher();
        Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        );
        return dispatcher.useContext(Context);
      };
      exports.useDebugValue = function(value, formatterFn) {
        return resolveDispatcher().useDebugValue(value, formatterFn);
      };
      exports.useDeferredValue = function(value, initialValue) {
        return resolveDispatcher().useDeferredValue(value, initialValue);
      };
      exports.useEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useEffect(create, deps);
      };
      exports.useEffectEvent = function(callback) {
        return resolveDispatcher().useEffectEvent(callback);
      };
      exports.useId = function() {
        return resolveDispatcher().useId();
      };
      exports.useImperativeHandle = function(ref, create, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create, deps);
      };
      exports.useInsertionEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useInsertionEffect(create, deps);
      };
      exports.useLayoutEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useLayoutEffect(create, deps);
      };
      exports.useMemo = function(create, deps) {
        return resolveDispatcher().useMemo(create, deps);
      };
      exports.useOptimistic = function(passthrough, reducer) {
        return resolveDispatcher().useOptimistic(passthrough, reducer);
      };
      exports.useReducer = function(reducer, initialArg, init) {
        return resolveDispatcher().useReducer(reducer, initialArg, init);
      };
      exports.useRef = function(initialValue) {
        return resolveDispatcher().useRef(initialValue);
      };
      exports.useState = function(initialState) {
        return resolveDispatcher().useState(initialState);
      };
      exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return resolveDispatcher().useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports.useTransition = function() {
        return resolveDispatcher().useTransition();
      };
      exports.version = "19.2.3";
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports, module) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module.exports = require_react_production();
    } else {
      module.exports = require_react_development();
    }
  }
});

// src/utils/analyzer.ts
var import_react = __toESM(require_react(), 1);

// src/constants/taxonomy.ts
var GOAL_CATEGORIES = [
  {
    id: "energy",
    label: "Energy & Vitality",
    icon: "\u26A1",
    // Specific energy-related terms only
    keywords: ["energy", "fatigue", "tired", "exhausted", "vitality", "stamina", "endurance", "alertness", "vigor", "lethargy", "sluggish", "low energy", "more energy", "boost energy", "chronic fatigue"]
  },
  {
    id: "brain",
    label: "Brain & Focus",
    icon: "\u{1F9E0}",
    // Removed 'work' - too generic. Focus on cognitive-specific terms
    keywords: ["focus", "concentration", "brain", "cognitive", "mental clarity", "attention", "brain fog", "thinking", "learning", "study", "memory", "recall", "sharp mind", "mental performance", "nootropic"]
  },
  {
    id: "mood",
    label: "Mood & Emotions",
    icon: "\u{1F60A}",
    // Removed 'drive' - ambiguous. Added more specific terms
    keywords: ["mood", "happiness", "depression", "depressed", "sadness", "emotional", "wellbeing", "well-being", "positivity", "motivation", "low mood", "mood swings", "irritability", "blues"]
  },
  {
    id: "stress",
    label: "Stress & Anxiety",
    icon: "\u{1F9D8}",
    // Removed 'pressure' - too generic. More specific stress terms
    keywords: ["stress", "anxiety", "anxious", "calm", "relax", "tension", "nervous", "worried", "panic", "overwhelmed", "cortisol", "burnout", "stressed", "anxiousness", "stress relief", "calming"]
  },
  {
    id: "sleep",
    label: "Sleep & Recovery",
    icon: "\u{1F634}",
    // Removed 'tired', 'fatigue' (covered by energy), 'morning', 'night', 'wake' - too generic
    keywords: ["sleep", "insomnia", "rest", "recovery", "bedtime", "circadian", "melatonin", "sleep quality", "deep sleep", "falling asleep", "stay asleep", "restful", "sleepless", "sleep aid"]
  },
  {
    id: "hormones",
    label: "Hormones & Balance",
    icon: "\u2696\uFE0F",
    // 'sex' is included to support user phrasing like "better sex" while keeping other ambiguous terms removed.
    keywords: ["hormone", "hormonal", "testosterone", "estrogen", "libido", "sex", "menopause", "perimenopause", "fertility", "thyroid", "adrenal", "cortisol", "hormonal balance", "hormone support", "low testosterone", "estrogen balance"]
  },
  {
    id: "sexual-health",
    label: "Sexual & Reproductive Health",
    icon: "\u2764\uFE0F",
    keywords: ["sexual health", "sexual", "erection", "erectile", "libido", "sex drive", "intimacy", "fertility", "sperm", "semen", "ejaculation", "refractory"]
  },
  {
    id: "immunity",
    label: "Immune Support",
    icon: "\u{1F6E1}\uFE0F",
    // Removed 'health' - too generic
    keywords: ["immune", "immunity", "cold", "flu", "sick", "infection", "virus", "defense", "protection", "resistance", "illness", "immune system", "immune support", "getting sick", "stay healthy"]
  },
  {
    id: "digestion",
    label: "Digestion & Gut",
    icon: "\u{1F9A0}",
    // Removed 'acid' - ambiguous. Added specific terms
    keywords: ["digestion", "digestive", "gut health", "stomach", "intestine", "bloating", "bloat", "constipation", "diarrhea", "microbiome", "probiotic", "ibs", "acid reflux", "indigestion", "gut flora", "bowel"]
  },
  {
    id: "fitness",
    label: "Fitness & Muscle",
    icon: "\u{1F4AA}",
    // Removed 'training', 'power' - could be generic. Added specific fitness terms
    keywords: ["muscle", "strength", "gym", "workout", "exercise", "fitness", "athletic", "performance", "gains", "bodybuilding", "crossfit", "muscle building", "muscle recovery", "lifting", "weightlifting", "sports"]
  },
  {
    id: "inflammation",
    label: "Inflammation & Pain",
    icon: "\u{1F525}",
    // Removed 'chronic', 'acute', 'injury' - too generic
    keywords: ["inflammation", "inflammatory", "pain", "ache", "sore", "joint pain", "arthritis", "swelling", "anti-inflammatory", "joint health", "stiffness", "muscle pain", "back pain", "chronic pain"]
  },
  {
    id: "bone-health",
    label: "Bone Health",
    icon: "\u{1F9B4}",
    keywords: ["bone health", "bone density", "osteoporosis", "fracture risk", "brittle bones", "bone strength"]
  },
  {
    id: "heart",
    label: "Heart & Cardio",
    icon: "\u2764\uFE0F",
    // Removed 'blood', 'beat', 'pulse' - too generic
    keywords: ["heart", "cardiovascular", "cardio health", "blood pressure", "cholesterol", "circulation", "artery", "heart health", "cardiac", "triglycerides", "hdl", "ldl", "vascular"]
  },
  {
    id: "beauty",
    label: "Skin, Hair & Beauty",
    icon: "\u2728",
    // Removed 'dry' - too generic
    keywords: ["skin", "hair", "nails", "beauty", "collagen", "wrinkle", "anti-aging", "glow", "complexion", "acne", "skin health", "hair growth", "hair loss", "nail strength", "youthful"]
  },
  {
    id: "longevity",
    label: "Longevity & Aging",
    icon: "\u23F3",
    keywords: ["longevity", "aging", "anti-aging", "healthy aging", "lifespan", "sirtuins", "senolytic", "cellular aging"]
  },
  {
    id: "metabolic",
    label: "Metabolic & Blood Sugar",
    icon: "\u{1FA78}",
    keywords: ["blood sugar", "glucose", "insulin", "metabolism", "metabolic", "a1c", "insulin resistance", "prediabetes"]
  },
  {
    id: "detox",
    label: "Liver & Detox",
    icon: "\u{1F9EA}",
    keywords: ["detox", "liver", "hepatic", "fatty liver", "toxins", "cleanse", "glutathione"]
  }
];
var SEMANTIC_ASSOCIATIONS = {
  "bone-health": {
    synonyms: ["bone health", "bone density", "osteoporosis", "brittle bones", "fracture risk", "bone strength"],
    supplements: ["Calcium", "Vitamin D3", "Vitamin K2", "Magnesium"],
    goals: ["bone-health", "osteoporosis"],
    systems: ["musculoskeletal"]
  },
  "brain-fog": {
    synonyms: ["brain fog", "mental fog", "foggy", "memory issues", "memory loss", "forgetful"],
    supplements: ["Lion's Mane", "Vitamin B12", "Omega-3", "Ginkgo Biloba"],
    goals: ["brain", "focus"],
    systems: ["nervous"]
  },
  "stress-anxiety": {
    synonyms: ["stress", "anxiety", "anxious", "panic", "overwhelmed", "calm", "relax"],
    supplements: ["Ashwagandha", "L-Theanine", "Rhodiola Rosea", "Magnesium"],
    goals: ["stress", "mood"],
    systems: ["nervous", "endocrine"]
  },
  "sleep-quality": {
    synonyms: ["sleep", "insomnia", "sleep quality", "stay asleep", "falling asleep", "restful"],
    supplements: ["Magnesium", "Melatonin", "Valerian Root", "Glycine"],
    goals: ["sleep"],
    systems: ["nervous"]
  },
  "energy-fatigue": {
    synonyms: ["energy", "fatigue", "tired", "exhausted", "low energy", "stamina"],
    supplements: ["B-Complex", "Iron", "CoQ10", "Cordyceps"],
    goals: ["energy"],
    systems: ["endocrine", "cardiovascular"]
  },
  "immune-support": {
    synonyms: ["immunity", "immune support", "getting sick", "cold", "flu", "infection"],
    supplements: ["Vitamin C", "Vitamin D3", "Zinc", "Elderberry"],
    goals: ["immunity"],
    systems: ["immune"]
  },
  "digestion-gut": {
    synonyms: ["digestion", "gut health", "bloating", "ibs", "constipation", "diarrhea"],
    supplements: ["Probiotics", "Ginger", "Triphala"],
    goals: ["digestion"],
    systems: ["digestive"]
  },
  "longevity-aging": {
    synonyms: ["anti-aging", "longevity", "healthy aging", "lifespan", "cellular aging"],
    supplements: ["Resveratrol", "CoQ10", "NAC", "Collagen"],
    goals: ["longevity"],
    systems: ["cardiovascular", "endocrine"]
  },
  "muscle-performance": {
    synonyms: ["muscle", "strength", "athletic", "performance", "workout recovery"],
    supplements: ["Creatine", "Beta-Alanine", "Magnesium"],
    goals: ["fitness", "muscle"],
    systems: ["musculoskeletal"]
  },
  "heart-health": {
    synonyms: ["heart health", "cardio", "blood pressure", "cholesterol", "circulation"],
    supplements: ["CoQ10", "Omega-3", "Magnesium"],
    goals: ["heart-health"],
    systems: ["cardiovascular"]
  },
  "focus-clarity": {
    synonyms: ["focus", "concentration", "mental clarity", "attention", "study"],
    supplements: ["Lion's Mane", "L-Theanine", "Caffeine"],
    goals: ["brain"],
    systems: ["nervous"]
  },
  "detox-liver": {
    synonyms: ["detox", "liver support", "fatty liver", "toxins"],
    supplements: ["Milk Thistle", "NAC", "Chlorella"],
    goals: ["detox"],
    systems: ["digestive"]
  },
  "inflammation-pain": {
    synonyms: ["inflammation", "joint pain", "arthritis", "pain relief", "sore"],
    supplements: ["Turmeric / Curcumin", "Omega-3", "Boswellia"],
    goals: ["inflammation"],
    systems: ["musculoskeletal"]
  },
  "hormonal-balance": {
    synonyms: ["hormones", "hormonal balance", "pms", "menopause", "testosterone"],
    supplements: ["Ashwagandha", "Maca Root", "Vitamin D3"],
    goals: ["hormones"],
    systems: ["endocrine"]
  },
  "skin-health": {
    synonyms: ["skin", "skin health", "acne", "glow", "wrinkles"],
    supplements: ["Collagen", "Vitamin C", "Vitamin E", "Zinc"],
    goals: ["beauty"],
    systems: ["integumentary"]
  },
  "hair-health": {
    synonyms: ["hair", "hair loss", "hair growth", "brittle hair"],
    supplements: ["Biotin", "Collagen", "Zinc", "Iron"],
    goals: ["beauty"],
    systems: ["integumentary"]
  },
  "weight-management": {
    synonyms: ["weight loss", "fat loss", "lose weight", "metabolism"],
    supplements: ["Chromium", "Acetyl-L-Carnitine", "Caffeine"],
    goals: ["metabolic"],
    systems: ["endocrine"]
  },
  "pregnancy-support": {
    synonyms: ["pregnancy", "prenatal", "trying to conceive"],
    supplements: ["Folate", "Iron", "Omega-3", "Choline"],
    goals: ["fertility"],
    systems: ["reproductive"]
  },
  "mood-support": {
    synonyms: ["mood", "depressed", "sadness", "irritability", "low mood"],
    supplements: ["Omega-3", "Vitamin D3", "B-Complex"],
    goals: ["mood"],
    systems: ["nervous"]
  }
};
var SYSTEM_DEFINITIONS = [
  {
    id: "nervous",
    label: "Nervous System",
    description: "Brain, spinal cord, nerves - controls cognition, mood, stress response",
    // Specific nervous system terms
    keywords: ["brain", "nervous", "cognitive", "anxiety", "stress", "focus", "memory", "neurotransmitter", "dopamine", "serotonin", "gaba", "neurological", "neural"]
  },
  {
    id: "endocrine",
    label: "Endocrine System",
    description: "Hormones, glands - controls metabolism, growth, mood, reproduction",
    // Removed 'metabolism' - too generic
    keywords: ["hormone", "thyroid", "adrenal", "cortisol", "testosterone", "estrogen", "insulin", "gland", "pituitary", "endocrine", "hormonal"]
  },
  {
    id: "immune",
    label: "Immune System",
    description: "Defense against pathogens, inflammation control",
    keywords: ["immune", "inflammation", "infection", "virus", "bacteria", "antibody", "cytokine", "autoimmune", "immunity", "pathogen"]
  },
  {
    id: "digestive",
    label: "Digestive System",
    description: "Gut, stomach, intestines, liver - nutrient absorption, detox",
    // Removed 'enzyme' - too generic in supplement context
    keywords: ["gut", "stomach", "intestine", "liver", "digest", "digestion", "microbiome", "probiotic", "bile", "colon", "bowel", "gastric"]
  },
  {
    id: "cardiovascular",
    label: "Cardiovascular System",
    description: "Heart, blood vessels - circulation, oxygen delivery",
    // Removed 'blood', 'pressure', 'pulse' - too generic
    keywords: ["heart", "cardiovascular", "artery", "vein", "circulation", "cholesterol", "cardiac", "vascular", "blood pressure", "triglycerides"]
  },
  {
    id: "musculoskeletal",
    label: "Musculoskeletal System",
    description: "Muscles, bones, joints - movement, structure, strength",
    // Removed 'strength', 'flexibility' - too generic
    keywords: ["muscle", "bone", "joint", "tendon", "ligament", "skeletal", "cartilage", "musculoskeletal", "osteo", "muscular"]
  },
  {
    id: "integumentary",
    label: "Integumentary System",
    description: "Skin, hair, nails - protection, appearance",
    keywords: ["skin", "hair", "nail", "collagen", "keratin", "dermis", "epidermis", "complexion", "dermal", "cutaneous"]
  },
  {
    id: "respiratory",
    label: "Respiratory System",
    description: "Lungs, airways - oxygen intake, CO2 removal",
    keywords: ["lung", "respiratory", "airway", "bronchi", "asthma", "breathing", "pulmonary", "bronchial"]
  },
  {
    id: "reproductive",
    label: "Reproductive System",
    description: "Fertility, libido, hormonal cycles",
    // Removed 'egg' - too generic
    keywords: ["reproductive", "fertility", "libido", "menstrual", "ovary", "testis", "sperm", "conception", "sexual health"]
  },
  {
    id: "urinary",
    label: "Urinary System",
    description: "Kidneys, bladder - waste removal, fluid balance",
    keywords: ["kidney", "bladder", "urinary", "renal", "nephro", "urological"]
  },
  {
    id: "lymphatic",
    label: "Lymphatic System",
    description: "Lymph nodes, drainage - immune support, detox",
    // Removed 'node', 'detox' - could be generic
    keywords: ["lymph", "lymphatic", "drainage", "spleen", "lymph nodes", "lymphoid"]
  }
];
var NEGATION_WORDS = [
  "no",
  "not",
  "don't",
  "dont",
  "doesn't",
  "doesnt",
  "without",
  "never",
  "none",
  "isn't",
  "isnt",
  "aren't",
  "arent",
  "haven't",
  "havent",
  "hasn't",
  "hasnt",
  "won't",
  "wont",
  "can't",
  "cant",
  "couldn't",
  "couldnt",
  "shouldn't",
  "shouldnt",
  "wouldn't",
  "wouldnt",
  "lack",
  "lacking",
  "free",
  "avoid",
  "stop"
];
var GOAL_ALIASES = {
  "brain-health": "brain",
  "cognition": "brain",
  "memory": "brain",
  "focus": "brain",
  "concentration": "brain",
  "learning": "brain",
  "brain-fog": "brain",
  "mental-clarity": "brain",
  "neuroprotection": "brain",
  "calm": "stress",
  "anxiety": "stress",
  "relaxation": "stress",
  "sleep": "sleep",
  "insomnia": "sleep",
  "recovery": "sleep",
  "energy": "energy",
  "vitality": "energy",
  "fatigue": "energy",
  "stamina": "energy",
  "endurance": "fitness",
  "athletic-performance": "fitness",
  "performance": "fitness",
  "strength": "fitness",
  "muscle": "fitness",
  "muscle-recovery": "fitness",
  "joint-pain": "inflammation",
  "joint-health": "inflammation",
  "arthritis": "inflammation",
  "pain": "inflammation",
  "bone-health": "bone-health",
  "bone density": "bone-health",
  "osteoporosis": "bone-health",
  "fracture risk": "bone-health",
  "brittle bones": "bone-health",
  "heart-health": "heart",
  "blood-pressure": "heart",
  "cholesterol": "heart",
  "circulation": "heart",
  "blood-sugar": "metabolic",
  "weight": "metabolic",
  "metabolism": "metabolic",
  "skin": "beauty",
  "hair": "beauty",
  "nails": "beauty",
  "beauty": "beauty",
  "anti-aging": "longevity",
  "longevity": "longevity",
  "detox": "detox",
  "liver": "detox",
  "hormonal-balance": "hormones",
  "testosterone": "hormones",
  "libido": "hormones",
  "sexual-health": "sexual-health",
  "sexual-function": "sexual-health",
  "sexual": "sexual-health",
  "sex-drive": "sexual-health",
  "intimacy": "sexual-health",
  "erectile": "sexual-health",
  "erectile-function": "sexual-health",
  "erection": "sexual-health",
  "semen": "sexual-health",
  "semen-volume": "sexual-health",
  "sperm": "sexual-health",
  "sperm-quality": "sexual-health",
  "sperm-count": "sexual-health",
  "sperm-motility": "sexual-health",
  "male-reproductive": "sexual-health",
  "female-reproductive": "sexual-health",
  "reproductive-health": "sexual-health",
  "fertility": "hormones",
  "menopause": "hormones",
  "pms": "hormones",
  "immunity": "immunity",
  "immune": "immunity",
  "respiratory": "immunity",
  "digestion": "digestion",
  "gut-health": "digestion",
  "bloating": "digestion"
};
var SYSTEM_ALIASES = {
  "cognitive": "nervous",
  "brain": "nervous",
  "neuro": "nervous",
  "metabolic": "endocrine",
  "energy": "endocrine",
  "hepatic": "digestive",
  "liver": "digestive",
  "detox": "digestive",
  "muscular": "musculoskeletal",
  "joint": "musculoskeletal",
  "skin": "integumentary",
  "hair": "integumentary",
  "nail": "integumentary"
};
var NEGATION_WINDOW = 3;
var SUPPLEMENT_ALIASES = {
  // Vitamins
  "d3": "Vitamin D3",
  "vitamin d": "Vitamin D3",
  "vit d": "Vitamin D3",
  "cholecalciferol": "Vitamin D3",
  "b12": "Vitamin B12",
  "vitamin b-12": "Vitamin B12",
  "cobalamin": "Vitamin B12",
  "methylcobalamin": "Vitamin B12",
  "cyanocobalamin": "Vitamin B12",
  "b-complex": "B-Complex",
  "b vitamins": "B-Complex",
  "vitamin c": "Vitamin C",
  "vit c": "Vitamin C",
  "ascorbic acid": "Vitamin C",
  "vitamin e": "Vitamin E",
  "tocopherol": "Vitamin E",
  "vitamin k": "Vitamin K2",
  "k2": "Vitamin K2",
  "mk-7": "Vitamin K2",
  "menaquinone": "Vitamin K2",
  "folate": "Folate",
  "folic acid": "Folate",
  "vitamin b9": "Folate",
  "b9": "Folate",
  // Minerals
  "mag": "Magnesium",
  "magnesium glycinate": "Magnesium",
  "magnesium citrate": "Magnesium",
  "mag glycinate": "Magnesium",
  "zn": "Zinc",
  "zinc picolinate": "Zinc",
  "zinc bisglycinate": "Zinc",
  "fe": "Iron",
  "iron bisglycinate": "Iron",
  "ferrous": "Iron",
  "selenium": "Selenium",
  "se": "Selenium",
  "selenomethionine": "Selenium",
  "ca": "Calcium",
  "calcium citrate": "Calcium",
  "potassium": "Potassium",
  "k": "Potassium",
  // Omega-3s
  "fish oil": "Omega-3",
  "omega 3": "Omega-3",
  "omega3": "Omega-3",
  "epa": "Omega-3",
  "dha": "Omega-3",
  "epa/dha": "Omega-3",
  "algae oil": "Omega-3",
  // Adaptogens
  "ashwa": "Ashwagandha",
  "withania": "Ashwagandha",
  "ksm-66": "Ashwagandha",
  "sensoril": "Ashwagandha",
  "rhodiola": "Rhodiola Rosea",
  "golden root": "Rhodiola Rosea",
  "arctic root": "Rhodiola Rosea",
  "ginseng": "Panax Ginseng",
  "korean ginseng": "Panax Ginseng",
  "red ginseng": "Panax Ginseng",
  "american ginseng": "Panax Ginseng",
  "maca": "Maca Root",
  "peruvian ginseng": "Maca Root",
  "eleuthero": "Eleuthero",
  "siberian ginseng": "Eleuthero",
  // Ayurvedic
  "brahmi": "Bacopa Monnieri",
  "bacopa": "Bacopa Monnieri",
  "tulsi": "Holy Basil (Tulsi)",
  "holy basil": "Holy Basil (Tulsi)",
  "triphala": "Triphala",
  "shatavari": "Shatavari",
  "guduchi": "Guduchi (Giloy)",
  "giloy": "Guduchi (Giloy)",
  "shilajit": "Shilajit",
  "mucuna": "Mucuna Pruriens",
  "velvet bean": "Mucuna Pruriens",
  "boswellia": "Boswellia",
  "frankincense": "Boswellia",
  "arjuna": "Arjuna",
  "amla": "Amla",
  "indian gooseberry": "Amla",
  // Mushrooms
  "lions mane": "Lion's Mane",
  "lion's mane": "Lion's Mane",
  "hericium": "Lion's Mane",
  "reishi": "Reishi",
  "ganoderma": "Reishi",
  "lingzhi": "Reishi",
  "cordyceps": "Cordyceps",
  "turkey tail": "Turkey Tail",
  "chaga": "Chaga",
  "maitake": "Maitake",
  // Amino Acids
  "theanine": "L-Theanine",
  "l theanine": "L-Theanine",
  "glycine": "Glycine",
  "taurine": "Taurine",
  "nac": "NAC (N-Acetyl Cysteine)",
  "n-acetyl cysteine": "NAC (N-Acetyl Cysteine)",
  "n acetyl cysteine": "NAC (N-Acetyl Cysteine)",
  "tyrosine": "L-Tyrosine",
  "l-tyrosine": "L-Tyrosine",
  "creatine": "Creatine Monohydrate",
  "creatine monohydrate": "Creatine Monohydrate",
  "carnitine": "L-Carnitine",
  "l-carnitine": "L-Carnitine",
  "acetyl-l-carnitine": "Acetyl-L-Carnitine (ALCAR)",
  "alcar": "Acetyl-L-Carnitine (ALCAR)",
  "citrulline": "L-Citrulline",
  "l-citrulline": "L-Citrulline",
  "arginine": "L-Arginine",
  "l-arginine": "L-Arginine",
  "glutamine": "L-Glutamine",
  "l-glutamine": "L-Glutamine",
  "beta-alanine": "Beta-Alanine",
  "beta alanine": "Beta-Alanine",
  "bcaas": "BCAAs",
  "bcaa": "BCAAs",
  "branched chain amino acids": "BCAAs",
  "eaas": "EAAs",
  "eaa": "EAAs",
  "essential amino acids": "EAAs",
  "hmb": "HMB",
  "beta-hydroxy beta-methylbutyrate": "HMB",
  "5-htp": "5-HTP",
  "5htp": "5-HTP",
  // Other common
  "coq10": "CoQ10 (Ubiquinol)",
  "ubiquinol": "CoQ10 (Ubiquinol)",
  "ubiquinone": "CoQ10 (Ubiquinol)",
  "coenzyme q10": "CoQ10 (Ubiquinol)",
  "turmeric": "Curcumin",
  "curcumin": "Curcumin",
  "ginger": "Ginger",
  "ginkgo": "Ginkgo Biloba",
  "ginkgo biloba": "Ginkgo Biloba",
  "valerian": "Valerian Root",
  "melatonin": "Melatonin",
  "collagen": "Collagen",
  "collagen peptides": "Collagen",
  "probiotics": "Probiotics",
  "probiotic": "Probiotics",
  "elderberry": "Elderberry",
  "echinacea": "Echinacea",
  "garlic": "Garlic",
  "milk thistle": "Milk Thistle",
  "silymarin": "Milk Thistle",
  "alpha-gpc": "Alpha-GPC",
  "alpha gpc": "Alpha-GPC",
  "phosphatidylserine": "Phosphatidylserine",
  "ps": "Phosphatidylserine",
  "berberine": "Berberine",
  "quercetin": "Quercetin",
  "resveratrol": "Resveratrol",
  "ala": "Alpha-Lipoic Acid",
  "alpha lipoic acid": "Alpha-Lipoic Acid",
  "alpha-lipoic acid": "Alpha-Lipoic Acid",
  "sam-e": "SAMe",
  "same": "SAMe",
  "s-adenosyl methionine": "SAMe",
  "glucosamine": "Glucosamine",
  "chondroitin": "Glucosamine",
  "msm": "MSM",
  "methylsulfonylmethane": "MSM",
  "astaxanthin": "Astaxanthin",
  "beetroot": "Beetroot Extract",
  "beet root": "Beetroot Extract",
  "beet juice": "Beetroot Extract",
  "nitrates": "Beetroot Extract",
  "whey": "Whey Protein",
  "whey protein": "Whey Protein",
  "casein": "Casein Protein",
  "caffeine": "Caffeine",
  "electrolytes": "Electrolytes",
  "sodium bicarbonate": "Sodium Bicarbonate",
  "baking soda": "Sodium Bicarbonate",
  "betaine": "Betaine (TMG)",
  "tmg": "Betaine (TMG)",
  "trimethylglycine": "Betaine (TMG)",
  "glycerol": "Glycerol"
};
var normalizeAliasLookupKey = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ");
var SUPPLEMENT_ALIAS_LOOKUP = /* @__PURE__ */ new Map();
for (const [alias, canonical] of Object.entries(SUPPLEMENT_ALIASES)) {
  SUPPLEMENT_ALIAS_LOOKUP.set(normalizeAliasLookupKey(alias), canonical);
}
function normalizeSupplementName(input) {
  const normalized = input.toLowerCase().trim();
  if (SUPPLEMENT_ALIASES[normalized]) {
    return SUPPLEMENT_ALIASES[normalized];
  }
  const normalizedKey = normalizeAliasLookupKey(input);
  if (!normalizedKey) {
    return input;
  }
  const directMatch = SUPPLEMENT_ALIAS_LOOKUP.get(normalizedKey);
  if (directMatch) {
    return directMatch;
  }
  for (const part of normalized.split(/[()/,+;|]+/)) {
    const partKey = normalizeAliasLookupKey(part);
    if (!partKey) continue;
    const partMatch = SUPPLEMENT_ALIAS_LOOKUP.get(partKey);
    if (partMatch) {
      return partMatch;
    }
  }
  return input;
}

// src/utils/normalization.ts
var GOAL_ID_SET = new Set(GOAL_CATEGORIES.map((goal) => goal.id));
var SYSTEM_ID_SET = new Set(SYSTEM_DEFINITIONS.map((system) => system.id));
function normalizeGoalId(goal) {
  const normalized = goal.toLowerCase();
  const alias = GOAL_ALIASES[normalized];
  const candidate = alias || normalized;
  if (GOAL_ID_SET.has(candidate)) {
    return candidate;
  }
  return null;
}
function normalizeGoals(goals = []) {
  const normalizedGoals = goals.map((goal) => normalizeGoalId(goal)).filter((goal) => Boolean(goal));
  return Array.from(new Set(normalizedGoals));
}
function normalizeSystemId(system) {
  const normalized = system.toLowerCase();
  const alias = SYSTEM_ALIASES[normalized];
  const candidate = alias || normalized;
  if (SYSTEM_ID_SET.has(candidate)) {
    return candidate;
  }
  return null;
}
function normalizeSystems(systems = []) {
  const normalizedSystems = systems.map((system) => normalizeSystemId(system)).filter((system) => Boolean(system));
  return Array.from(new Set(normalizedSystems));
}

// src/data/nutrientRequirements.ts
var REFERENCES = {
  vitaminD: {
    title: "NIH ODS: Vitamin D Fact Sheet",
    url: "https://ods.od.nih.gov/factsheets/VitaminD-Consumer/"
  },
  vitaminB12: {
    title: "NIH ODS: Vitamin B12 Fact Sheet",
    url: "https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/"
  },
  iron: {
    title: "NIH ODS: Iron Fact Sheet",
    url: "https://ods.od.nih.gov/factsheets/Iron-Consumer/"
  },
  calcium: {
    title: "NIH ODS: Calcium Fact Sheet",
    url: "https://ods.od.nih.gov/factsheets/Calcium-Consumer/"
  },
  magnesium: {
    title: "NIH ODS: Magnesium Fact Sheet",
    url: "https://ods.od.nih.gov/factsheets/Magnesium-Consumer/"
  },
  zinc: {
    title: "NIH ODS: Zinc Fact Sheet",
    url: "https://ods.od.nih.gov/factsheets/Zinc-Consumer/"
  },
  folate: {
    title: "NIH ODS: Folate Fact Sheet",
    url: "https://ods.od.nih.gov/factsheets/Folate-Consumer/"
  },
  omega3: {
    title: "NIH ODS: Omega-3 Fatty Acids Fact Sheet",
    url: "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-Consumer/"
  },
  iodine: {
    title: "NIH ODS: Iodine Fact Sheet",
    url: "https://ods.od.nih.gov/factsheets/Iodine-Consumer/"
  }
};
var AGE_GROUPS = ["18-29", "30-44", "45-59", "60+"];
var normalizeSex = (sex) => sex === "female" ? "female" : "male";
var mapAgeRange = (ageRange) => {
  switch (ageRange) {
    case "under-30":
      return "18-29";
    case "30-45":
      return "30-44";
    case "45-60":
      return "45-59";
    case "over-60":
      return "60+";
    default:
      return null;
  }
};
var normalizeAge = (age, ageRange) => {
  if (age && AGE_GROUPS.includes(age)) return age;
  const mappedRange = mapAgeRange(ageRange);
  if (mappedRange) return mappedRange;
  return "30-44";
};
var isOlderAdult = (age) => age === "60+";
function buildNutrientTargets(profile) {
  const sex = normalizeSex(profile.sex);
  const age = normalizeAge(profile.age, profile.ageRange);
  const diet = profile.diet || profile.dietType;
  const targets = [];
  const vitaminDTarget = isOlderAdult(age) ? "20" : "15";
  targets.push({
    id: "vitamin-d",
    name: "Vitamin D",
    target: `${vitaminDTarget} mcg (600-800 IU)`,
    unit: "mcg",
    priority: isOlderAdult(age) ? "high" : "baseline",
    rationale: [
      "Supports bone health, immune function, and muscle strength.",
      isOlderAdult(age) ? "Older adults typically require higher intake." : "Many adults fall short due to limited sun exposure."
    ],
    foodSources: ["Fatty fish", "Fortified dairy/plant milks", "Egg yolk"],
    supplementIds: ["vitamin-d3"],
    references: [REFERENCES.vitaminD]
  });
  targets.push({
    id: "vitamin-b12",
    name: "Vitamin B12",
    target: "2.4 mcg",
    unit: "mcg",
    priority: diet === "vegan" ? "high" : diet === "vegetarian" ? "medium" : "baseline",
    rationale: [
      "Essential for nerve function and red blood cell formation.",
      diet === "vegan" ? "Plant-based diets lack reliable B12 sources." : diet === "vegetarian" ? "Dairy/eggs supply B12, but intake can still be low." : "Deficiency risk rises with low animal food intake."
    ],
    foodSources: ["Fortified foods", "Fish", "Eggs", "Dairy"],
    supplementIds: ["vitamin-b12"],
    references: [REFERENCES.vitaminB12]
  });
  const ironTarget = sex === "female" && (age === "18-29" || age === "30-44") ? "18" : "8";
  targets.push({
    id: "iron",
    name: "Iron",
    target: `${ironTarget} mg`,
    unit: "mg",
    priority: diet === "vegan" ? "high" : diet === "vegetarian" ? "medium" : "baseline",
    rationale: [
      "Supports oxygen transport and energy metabolism.",
      sex === "female" && (age === "18-29" || age === "30-44") ? "Premenopausal needs are higher due to monthly losses." : "Endurance training and low meat intake can raise risk."
    ],
    foodSources: ["Red meat", "Lentils", "Spinach", "Fortified cereals"],
    supplementIds: ["iron"],
    references: [REFERENCES.iron]
  });
  const calciumTarget = isOlderAdult(age) ? "1200" : "1000";
  targets.push({
    id: "calcium",
    name: "Calcium",
    target: `${calciumTarget} mg`,
    unit: "mg",
    priority: isOlderAdult(age) ? "high" : "baseline",
    rationale: [
      "Supports bone density and neuromuscular function.",
      isOlderAdult(age) ? "Needs rise with age to protect bone health." : "Adequate intake supports peak bone mass."
    ],
    foodSources: ["Dairy", "Fortified plant milk", "Leafy greens", "Canned fish with bones"],
    supplementIds: ["calcium"],
    references: [REFERENCES.calcium]
  });
  const magnesiumTarget = sex === "female" ? "310-320" : "400-420";
  targets.push({
    id: "magnesium",
    name: "Magnesium",
    target: `${magnesiumTarget} mg`,
    unit: "mg",
    priority: profile.stressLevel === "high" || profile.stressLevel === "very-high" ? "medium" : "baseline",
    rationale: [
      "Supports energy production, muscle function, and sleep quality.",
      "Many diets fall below recommended intake."
    ],
    foodSources: ["Pumpkin seeds", "Legumes", "Dark chocolate", "Leafy greens"],
    supplementIds: ["magnesium"],
    references: [REFERENCES.magnesium]
  });
  const zincTarget = sex === "female" ? "8" : "11";
  targets.push({
    id: "zinc",
    name: "Zinc",
    target: `${zincTarget} mg`,
    unit: "mg",
    priority: diet === "vegan" ? "medium" : "baseline",
    rationale: [
      "Supports immune function, wound healing, and hormones.",
      diet === "vegan" ? "Plant sources have lower bioavailability." : "Athletes may benefit from higher intake."
    ],
    foodSources: ["Oysters", "Beef", "Pumpkin seeds", "Chickpeas"],
    supplementIds: ["zinc"],
    references: [REFERENCES.zinc]
  });
  targets.push({
    id: "folate",
    name: "Folate",
    target: "400 mcg DFE",
    unit: "mcg",
    priority: "baseline",
    rationale: [
      "Supports DNA synthesis, red blood cells, and energy.",
      "Low intake can worsen fatigue and mood."
    ],
    foodSources: ["Leafy greens", "Beans", "Asparagus", "Fortified grains"],
    supplementIds: ["folate"],
    references: [REFERENCES.folate]
  });
  const omegaTarget = sex === "female" ? "1.1" : "1.6";
  targets.push({
    id: "omega-3",
    name: "Omega-3 (ALA)",
    target: `${omegaTarget} g ALA + 250-500 mg EPA/DHA`,
    unit: "g",
    priority: diet === "vegan" || diet === "vegetarian" ? "medium" : "baseline",
    rationale: [
      "Supports cardiovascular, cognitive, and inflammatory balance.",
      diet === "vegan" || diet === "vegetarian" ? "EPA/DHA often low without fatty fish or algae sources." : "Most diets still fall short of EPA/DHA targets."
    ],
    foodSources: ["Salmon", "Sardines", "Chia seeds", "Algae oil"],
    supplementIds: ["omega-3"],
    references: [REFERENCES.omega3]
  });
  targets.push({
    id: "iodine",
    name: "Iodine",
    target: "150 mcg",
    unit: "mcg",
    priority: diet === "vegan" ? "medium" : "baseline",
    rationale: [
      "Supports thyroid hormone production and metabolism.",
      diet === "vegan" ? "Iodized salt and sea vegetables are key sources." : "Intake varies widely by salt use."
    ],
    foodSources: ["Iodized salt", "Seaweed", "Dairy", "Fish"],
    supplementIds: [],
    references: [REFERENCES.iodine]
  });
  return targets;
}

// src/data/stacks.ts
var premadeStacks = [
  /** Source: STACKS_ALIGNMENT_RESEARCH_REPORT.md */
  {
    id: "reproductive-foundation",
    name: "Reproductive Health Foundation Stack",
    description: "Foundational nutrient plus adaptogen support for libido, hormone balance, and fertility.",
    targetGender: "all",
    primaryGoal: "fertility",
    synergyDescription: "Zinc, selenium, folate, vitamin D, omega-3, magnesium, and boron support reproductive nutrient status while ashwagandha and shilajit bolster stress resilience and vitality. CoQ10 and carnitine support mitochondrial fertility; see gender-specific stacks for targeted herbal additions.",
    ingredients: [
      {
        supplementId: "zinc",
        dosage: "15\u201330 mg daily",
        reason: "Supports testosterone production, sperm health, and libido; take with meals to limit GI upset."
      },
      {
        supplementId: "selenium",
        dosage: "100\u2013200 mcg daily",
        reason: "Antioxidant support for sperm motility and thyroid function."
      },
      {
        supplementId: "folate",
        dosage: "400 mcg daily",
        reason: "Supports DNA synthesis and works synergistically with zinc in sperm development."
      },
      {
        supplementId: "vitamin-d3",
        dosage: "2,000 IU daily",
        reason: "Supports reproductive hormone balance and sperm motility; take with a fatty meal for absorption."
      },
      {
        supplementId: "omega-3",
        dosage: "500 mg EPA+DHA daily (\u2265200 mg DHA)",
        reason: "Supports sperm membrane integrity and vascular health."
      },
      {
        supplementId: "magnesium",
        dosage: "300\u2013400 mg nightly (citrate or glycinate)",
        reason: "Supports testosterone and sperm parameters while helping activate vitamin D."
      },
      {
        supplementId: "boron",
        dosage: "3\u20136 mg daily",
        reason: "Supports free testosterone and helps convert vitamin D to its active form."
      },
      {
        supplementId: "ashwagandha",
        dosage: "300\u2013600 mg extract, 1\u20132\xD7 daily",
        reason: "Adaptogen that reduces cortisol while supporting testosterone and sexual function."
      },
      {
        supplementId: "coq10",
        dosage: "200\u2013300 mg daily",
        reason: "Supports mitochondrial energy and sperm motility in fertility-focused protocols."
      },
      {
        supplementId: "acetyl-l-carnitine",
        dosage: "1\u20132 g daily",
        reason: "Supports sperm energy metabolism and motility."
      },
      {
        supplementId: "shilajit",
        dosage: "150\u2013250 mg daily",
        reason: "Mineral-rich resin that boosts stamina and supports testosterone."
      },
      {
        supplementId: "maca",
        dosage: "1,500 mg once or twice daily",
        reason: "Improves sexual desire and mood without directly altering testosterone."
      }
    ]
  },
  /** Source: STACKS_ALIGNMENT_RESEARCH_REPORT.md */
  {
    id: "male-libido-fertility",
    name: "Male Libido & Fertility Stack",
    description: "Targeted male stack focused on testosterone, libido, sperm quality, and prostate support.",
    targetGender: "men",
    primaryGoal: "libido",
    synergyDescription: "Ashwagandha and shilajit amplify stress resilience and vitality, while tongkat ali plus mucuna support testosterone and dopamine-driven libido. Zinc, selenium, folate, vitamin D, omega-3, CoQ10, tribulus, and carnitine anchor hormone output and sperm metrics.",
    ingredients: [
      {
        supplementId: "zinc",
        dosage: "15\u201330 mg daily",
        reason: "Essential for testosterone and sperm production; take with food."
      },
      {
        supplementId: "selenium",
        dosage: "100\u2013200 mcg daily",
        reason: "Antioxidant support for sperm motility and thyroid balance."
      },
      {
        supplementId: "folate",
        dosage: "400 mcg daily",
        reason: "Supports DNA synthesis in spermatogenesis; commonly paired with zinc."
      },
      {
        supplementId: "vitamin-d3",
        dosage: "2,000 IU daily",
        reason: "Supports testosterone and sperm motility; take with a fatty meal."
      },
      {
        supplementId: "omega-3",
        dosage: "500 mg EPA+DHA daily (\u2265200 mg DHA)",
        reason: "Supports sperm membrane integrity and vascular function."
      },
      {
        supplementId: "magnesium",
        dosage: "300\u2013400 mg nightly (citrate or glycinate)",
        reason: "Supports testosterone and sperm motility while aiding vitamin D activation."
      },
      {
        supplementId: "boron",
        dosage: "3\u20136 mg daily",
        reason: "Supports testosterone metabolism and mineral balance."
      },
      {
        supplementId: "ashwagandha",
        dosage: "300\u2013600 mg extract, 1\u20132\xD7 daily",
        reason: "Improves libido and sexual function while lowering stress."
      },
      {
        supplementId: "coq10",
        dosage: "200\u2013300 mg daily",
        reason: "Supports mitochondrial energy and sperm motility."
      },
      {
        supplementId: "tribulus",
        dosage: "750\u20131500 mg daily",
        reason: "Supports sperm count, motility, and libido over a full 3\u20136 month cycle."
      },
      {
        supplementId: "acetyl-l-carnitine",
        dosage: "1\u20132 g daily",
        reason: "Supports sperm energy metabolism and motility over 3\u20136 months."
      },
      {
        supplementId: "l-carnitine",
        dosage: "2\u20133 g daily",
        reason: "Supports sperm motility and mitochondrial energy; pair with CoQ10."
      },
      {
        supplementId: "l-citrulline",
        dosage: "1.5\u20133 g daily",
        reason: "Supports nitric-oxide-driven blood flow; avoid with nitrates or low BP."
      },
      {
        supplementId: "shilajit",
        dosage: "150\u2013250 mg daily",
        reason: "Boosts stamina and total/free testosterone in men."
      },
      {
        supplementId: "tongkat-ali",
        dosage: "200\u2013300 mg daily",
        reason: "Traditionally used to raise testosterone and improve libido."
      },
      {
        supplementId: "mucuna",
        dosage: "500\u20131000 mg daily (standardized L-DOPA)",
        reason: "L-DOPA source that supports dopamine, testosterone, and semen quality."
      },
      {
        supplementId: "maca",
        dosage: "1,500 mg once or twice daily",
        reason: "Enhances sexual desire and energy over 8\u201312 weeks."
      },
      {
        supplementId: "saw-palmetto",
        dosage: "160 mg twice daily (320 mg total)",
        reason: "Supports prostate health and preserves free testosterone by modulating DHT."
      }
    ]
  },
  /** Source: STACKS_ALIGNMENT_RESEARCH_REPORT.md */
  {
    id: "female-hormone-fertility",
    name: "Female Hormone & Fertility Stack",
    description: "Women-focused stack supporting hormone balance, fertility, and reproductive vitality.",
    targetGender: "women",
    primaryGoal: "fertility",
    synergyDescription: "Foundational micronutrients (folate/folic acid, iodine, vitamin D, omega-3, zinc, magnesium) support preconception health while vitex, myo-inositol, shatavari, and ashwagandha address cycle balance, ovulation, and stress. Add iron only if ferritin is low.",
    ingredients: [
      {
        supplementId: "folate",
        dosage: "400\u2013800 mcg daily",
        reason: "Core preconception nutrient (folic acid or methylfolate) that supports neural tube development and methylation."
      },
      {
        supplementId: "iodine",
        dosage: "150 mcg daily",
        reason: "Supports thyroid hormone production and early fetal neurodevelopment."
      },
      {
        supplementId: "zinc",
        dosage: "15\u201330 mg daily",
        reason: "Supports reproductive hormone balance and overall fertility."
      },
      {
        supplementId: "vitamin-d3",
        dosage: "2,000 IU daily",
        reason: "Supports hormone balance and reproductive outcomes."
      },
      {
        supplementId: "omega-3",
        dosage: "500 mg EPA+DHA daily (\u2265200 mg DHA)",
        reason: "Supports fetal brain development and may reduce preterm risk."
      },
      {
        supplementId: "magnesium",
        dosage: "300\u2013400 mg nightly (citrate or glycinate)",
        reason: "Supports hormone balance and vitamin D activation while aiding recovery."
      },
      {
        supplementId: "boron",
        dosage: "3\u20136 mg daily",
        reason: "Supports estrogen metabolism and hormone balance."
      },
      {
        supplementId: "shatavari",
        dosage: "500 mg twice daily",
        reason: "Traditional female tonic that supports fertility, menstrual balance, and libido."
      },
      {
        supplementId: "vitex",
        dosage: "400 mg daily",
        reason: "Supports ovulation quality and progesterone balance; discontinue once pregnant."
      },
      {
        supplementId: "inositol",
        dosage: "2\u20134 g daily",
        reason: "Supports ovulation and insulin signaling, especially in PCOS."
      },
      {
        supplementId: "ashwagandha",
        dosage: "300\u2013600 mg extract, 1\u20132\xD7 daily",
        reason: "Adaptogen to reduce stress and support libido and energy (stop once pregnant)."
      },
      {
        supplementId: "maca",
        dosage: "1,500 mg once or twice daily",
        reason: "Supports mood, energy, and sexual desire (use preconception only)."
      }
    ]
  },
  /** Source: STACKS_ALIGNMENT_RESEARCH_REPORT.md */
  {
    id: "female-ovulation-optimizer",
    name: "Female Ovulation Optimizer",
    description: "Targeted female protocol to support ovulation quality and cycle regularity.",
    targetGender: "women",
    primaryGoal: "fertility",
    synergyDescription: "Vitex and myo-inositol drive cycle and ovulation support, while CoQ10, vitamin D3, and folate provide mitochondrial and preconception coverage.",
    ingredients: [
      {
        supplementId: "vitex",
        dosage: "400 mg daily",
        reason: "Supports progesterone balance and ovulation quality; discontinue once pregnant."
      },
      {
        supplementId: "inositol",
        dosage: "2\u20134 g daily",
        reason: "Supports ovulation and insulin sensitivity, especially in PCOS."
      },
      {
        supplementId: "coq10",
        dosage: "200\u2013300 mg daily",
        reason: "Mitochondrial support for egg quality and reproductive energy."
      },
      {
        supplementId: "vitamin-d3",
        dosage: "2,000 IU daily",
        reason: "Supports hormone balance and reproductive outcomes; take with fat."
      },
      {
        supplementId: "folate",
        dosage: "400\u2013800 mcg daily",
        reason: "Core preconception nutrient for methylation and early fetal development."
      }
    ]
  },
  /** Source: STACKS_ALIGNMENT_RESEARCH_REPORT.md */
  {
    id: "male-sperm-optimizer",
    name: "Male Sperm Optimizer",
    description: "Male-focused protocol to improve sperm count, motility, and mitochondrial output.",
    targetGender: "men",
    primaryGoal: "fertility",
    synergyDescription: "Tribulus, mucuna, and carnitine support sperm metrics and libido, while CoQ10 and zinc enhance mitochondrial and antioxidant defense.",
    ingredients: [
      {
        supplementId: "tribulus",
        dosage: "750\u20131500 mg daily",
        reason: "Supports sperm count, motility, and libido over a 3\u20136 month cycle."
      },
      {
        supplementId: "l-carnitine",
        dosage: "2\u20133 g daily",
        reason: "Improves sperm motility and mitochondrial energy production."
      },
      {
        supplementId: "coq10",
        dosage: "200\u2013300 mg daily",
        reason: "Mitochondrial antioxidant support for sperm quality."
      },
      {
        supplementId: "mucuna",
        dosage: "500\u20131000 mg daily (standardized L-DOPA)",
        reason: "Supports dopamine-driven libido and semen quality."
      },
      {
        supplementId: "zinc",
        dosage: "30\u201350 mg daily",
        reason: "Essential for spermatogenesis and testosterone support."
      }
    ]
  },
  /** Source: STACKS_ALIGNMENT_RESEARCH_REPORT.md */
  {
    id: "couples-fertility-protocol",
    name: "Couples Fertility Protocol",
    description: "Combined protocol for partners preparing for conception.",
    targetGender: "all",
    primaryGoal: "fertility",
    synergyDescription: "Combines male and female fertility drivers with shared mitochondrial and micronutrient support to cover the full preconception window.",
    ingredients: [
      {
        supplementId: "vitex",
        dosage: "400 mg daily (female)",
        reason: "Female ovulation and progesterone support; discontinue once pregnant."
      },
      {
        supplementId: "inositol",
        dosage: "2\u20134 g daily (female)",
        reason: "Female ovulation and insulin sensitivity support."
      },
      {
        supplementId: "tribulus",
        dosage: "750\u20131500 mg daily (male)",
        reason: "Male sperm quality and libido support."
      },
      {
        supplementId: "l-carnitine",
        dosage: "2\u20133 g daily (male)",
        reason: "Male sperm motility and energy support."
      },
      {
        supplementId: "coq10",
        dosage: "200\u2013300 mg daily (shared)",
        reason: "Shared mitochondrial support for egg and sperm quality."
      },
      {
        supplementId: "vitamin-d3",
        dosage: "2,000 IU daily (shared)",
        reason: "Shared hormone balance support; take with fat."
      },
      {
        supplementId: "folate",
        dosage: "400\u2013800 mcg daily (shared)",
        reason: "Shared preconception methylation support."
      },
      {
        supplementId: "zinc",
        dosage: "15\u201330 mg daily (shared)",
        reason: "Shared reproductive nutrient support."
      }
    ]
  },
  {
    id: "energy-vitality",
    name: "Energy & Vitality Stack",
    description: "Daily energy support for sustained stamina, mitochondrial output, and reduced fatigue.",
    targetGender: "all",
    primaryGoal: "energy",
    synergyDescription: "CoQ10 and B-complex fuel cellular energy production, while rhodiola buffers fatigue and vitamin D supports overall vitality.",
    ingredients: [
      {
        supplementId: "coq10",
        dosage: "100\u2013200 mg daily with meals",
        reason: "Supports mitochondrial energy and cardiovascular endurance."
      },
      {
        supplementId: "b-complex",
        dosage: "1 capsule daily with food",
        reason: "Supports energy metabolism and stress resilience."
      },
      {
        supplementId: "rhodiola",
        dosage: "200\u2013400 mg daily in the morning",
        reason: "Adaptogen that improves energy and reduces fatigue."
      },
      {
        supplementId: "vitamin-d3",
        dosage: "2,000 IU daily with a fatty meal",
        reason: "Supports energy levels and immune resilience."
      }
    ]
  },
  {
    id: "brain-focus",
    name: "Brain & Focus Stack",
    description: "Cognitive clarity stack for focus, memory, and mental stamina.",
    targetGender: "all",
    primaryGoal: "brain",
    synergyDescription: "Lion\u2019s mane supports neurogenesis, bacopa boosts memory, omega-3 nourishes brain tissue, and L-theanine smooths focus.",
    ingredients: [
      {
        supplementId: "lions-mane",
        dosage: "500\u20131,000 mg daily",
        reason: "Supports nerve growth factors and cognitive clarity."
      },
      {
        supplementId: "brahmi-bacopa",
        dosage: "300 mg daily",
        reason: "Improves memory formation and focus over time."
      },
      {
        supplementId: "omega-3",
        dosage: "1\u20132 g combined EPA/DHA daily",
        reason: "Supports brain structure and cognitive performance."
      },
      {
        supplementId: "l-theanine",
        dosage: "100\u2013200 mg as needed",
        reason: "Promotes calm focus without sedation."
      }
    ]
  },
  {
    id: "mood-stress",
    name: "Mood & Stress Support Stack",
    description: "Mood-balancing stack to support emotional resilience and calm.",
    targetGender: "all",
    primaryGoal: "mood",
    synergyDescription: "Ashwagandha and rhodiola stabilize stress response, magnesium supports relaxation, and L-theanine improves calm focus.",
    ingredients: [
      {
        supplementId: "ashwagandha",
        dosage: "300\u2013600 mg extract, 1\u20132\xD7 daily",
        reason: "Reduces cortisol and supports stress resilience."
      },
      {
        supplementId: "rhodiola",
        dosage: "200\u2013400 mg daily in the morning",
        reason: "Improves stress adaptation and energy."
      },
      {
        supplementId: "magnesium",
        dosage: "300\u2013400 mg nightly (citrate or glycinate)",
        reason: "Supports relaxation and mood stability."
      },
      {
        supplementId: "l-theanine",
        dosage: "100\u2013200 mg as needed",
        reason: "Calms the nervous system and smooths mood swings."
      }
    ]
  },
  {
    id: "sleep-recovery",
    name: "Sleep & Recovery Stack",
    description: "Nighttime support for deeper sleep quality and recovery.",
    targetGender: "all",
    primaryGoal: "sleep",
    synergyDescription: "Magnesium and glycine promote relaxation, melatonin helps regulate sleep timing, and valerian supports deeper sleep cycles.",
    ingredients: [
      {
        supplementId: "magnesium",
        dosage: "300\u2013400 mg nightly (citrate or glycinate)",
        reason: "Relaxes the nervous system for sleep onset."
      },
      {
        supplementId: "glycine",
        dosage: "3 g 30\u201360 minutes before bed",
        reason: "Improves sleep quality and overnight recovery."
      },
      {
        supplementId: "melatonin",
        dosage: "0.5\u20133 mg 30 minutes before bed",
        reason: "Supports circadian rhythm and sleep onset."
      },
      {
        supplementId: "valerian",
        dosage: "400\u2013600 mg before bed",
        reason: "Promotes relaxation and sleep depth."
      }
    ]
  },
  {
    id: "hormone-balance",
    name: "Hormone Balance Stack",
    description: "Foundational nutrients for steady hormone support and recovery.",
    targetGender: "all",
    primaryGoal: "hormones",
    synergyDescription: "Vitamin D, magnesium, zinc, and boron support hormone synthesis and balance, while ashwagandha helps buffer stress impact.",
    ingredients: [
      {
        supplementId: "vitamin-d3",
        dosage: "2,000 IU daily with a fatty meal",
        reason: "Supports hormone balance and immune resilience."
      },
      {
        supplementId: "magnesium",
        dosage: "300\u2013400 mg nightly",
        reason: "Supports hormone signaling and recovery."
      },
      {
        supplementId: "zinc",
        dosage: "15\u201330 mg daily",
        reason: "Supports hormone production and immune health."
      },
      {
        supplementId: "boron",
        dosage: "3\u20136 mg daily",
        reason: "Supports free hormone availability."
      },
      {
        supplementId: "ashwagandha",
        dosage: "300\u2013600 mg extract, 1\u20132\xD7 daily",
        reason: "Buffers stress-driven hormone disruption."
      }
    ]
  },
  {
    id: "immunity-defense",
    name: "Immune Defense Stack",
    description: "Immune readiness stack for daily defense and resilience.",
    targetGender: "all",
    primaryGoal: "immunity",
    synergyDescription: "Vitamin C and zinc support immune response, vitamin D primes defenses, and elderberry plus echinacea add botanical support.",
    ingredients: [
      {
        supplementId: "vitamin-c",
        dosage: "500\u20131,000 mg daily",
        reason: "Supports immune cell function and antioxidant protection."
      },
      {
        supplementId: "vitamin-d3",
        dosage: "2,000 IU daily",
        reason: "Supports immune readiness and inflammation balance."
      },
      {
        supplementId: "zinc",
        dosage: "15\u201330 mg daily with food",
        reason: "Supports immune signaling and recovery."
      },
      {
        supplementId: "elderberry",
        dosage: "500 mg daily",
        reason: "Botanical support for immune resilience."
      },
      {
        supplementId: "echinacea",
        dosage: "300\u2013500 mg daily",
        reason: "Traditional immune support botanical."
      }
    ]
  },
  {
    id: "digestion-gut",
    name: "Digestion & Gut Stack",
    description: "Gut-friendly stack for digestion, comfort, and microbial balance.",
    targetGender: "all",
    primaryGoal: "digestion",
    synergyDescription: "Probiotics balance the microbiome while ginger and peppermint soothe digestion, supported by turmeric\u2019s anti-inflammatory profile.",
    ingredients: [
      {
        supplementId: "probiotics",
        dosage: "10\u201320B CFU daily",
        reason: "Supports gut microbiome balance and digestion."
      },
      {
        supplementId: "ginger",
        dosage: "500\u20131,000 mg daily",
        reason: "Supports digestion and reduces nausea."
      },
      {
        supplementId: "peppermint-tea",
        dosage: "1\u20132 cups daily",
        reason: "Soothes digestion and eases bloating."
      },
      {
        supplementId: "turmeric-curcumin",
        dosage: "500\u20131,000 mg daily with food",
        reason: "Supports gut inflammation balance."
      }
    ]
  },
  {
    id: "fitness-performance",
    name: "Fitness & Muscle Stack",
    description: "Performance stack for strength, endurance, and workout recovery.",
    targetGender: "all",
    primaryGoal: "fitness",
    synergyDescription: "Creatine powers strength, beta-alanine supports muscular endurance, L-citrulline boosts blood flow, and beetroot improves stamina.",
    ingredients: [
      {
        supplementId: "creatine",
        dosage: "3\u20135 g daily",
        reason: "Improves strength, power, and recovery."
      },
      {
        supplementId: "beta-alanine",
        dosage: "2\u20133 g daily",
        reason: "Buffers muscle fatigue for higher training volume."
      },
      {
        supplementId: "l-citrulline",
        dosage: "3\u20136 g pre-workout",
        reason: "Increases nitric oxide for better pumps and endurance."
      },
      {
        supplementId: "beetroot-extract",
        dosage: "1\u20132 g pre-workout",
        reason: "Supports endurance and blood flow."
      }
    ]
  },
  {
    id: "inflammation-relief",
    name: "Inflammation & Recovery Stack",
    description: "Anti-inflammatory stack for joint comfort and recovery support.",
    targetGender: "all",
    primaryGoal: "inflammation",
    synergyDescription: "Turmeric and boswellia reduce inflammatory pathways, omega-3 supports joint comfort, and resveratrol adds antioxidant protection.",
    ingredients: [
      {
        supplementId: "turmeric-curcumin",
        dosage: "500\u20131,000 mg daily with food",
        reason: "Supports inflammation balance and recovery."
      },
      {
        supplementId: "boswellia",
        dosage: "300\u2013500 mg daily",
        reason: "Supports joint comfort and inflammation modulation."
      },
      {
        supplementId: "omega-3",
        dosage: "1\u20132 g combined EPA/DHA daily",
        reason: "Supports inflammation balance and cardiovascular health."
      },
      {
        supplementId: "resveratrol",
        dosage: "100\u2013200 mg daily",
        reason: "Provides antioxidant support for recovery."
      }
    ]
  },
  {
    id: "heart-cardio",
    name: "Heart & Cardio Stack",
    description: "Cardio-focused stack for circulation, heart health, and energy.",
    targetGender: "all",
    primaryGoal: "heart",
    synergyDescription: "Omega-3 and CoQ10 support heart function, magnesium supports rhythm and recovery, and beetroot improves circulation.",
    ingredients: [
      {
        supplementId: "omega-3",
        dosage: "1\u20132 g combined EPA/DHA daily",
        reason: "Supports heart health and healthy triglycerides."
      },
      {
        supplementId: "coq10",
        dosage: "100\u2013200 mg daily",
        reason: "Supports cardiac energy production."
      },
      {
        supplementId: "magnesium",
        dosage: "300\u2013400 mg nightly",
        reason: "Supports healthy heart rhythm."
      },
      {
        supplementId: "beetroot-extract",
        dosage: "1\u20132 g daily",
        reason: "Supports circulation and nitric oxide production."
      }
    ]
  },
  {
    id: "skin-beauty",
    name: "Skin & Beauty Stack",
    description: "Glow-support stack for skin hydration, elasticity, and hair health.",
    targetGender: "all",
    primaryGoal: "beauty",
    synergyDescription: "Collagen and hyaluronic acid support skin structure, biotin supports hair and nails, and vitamin C boosts collagen synthesis.",
    ingredients: [
      {
        supplementId: "collagen",
        dosage: "10 g daily",
        reason: "Supports skin elasticity and connective tissue."
      },
      {
        supplementId: "hyaluronic-acid",
        dosage: "120\u2013240 mg daily",
        reason: "Supports skin hydration and joint comfort."
      },
      {
        supplementId: "biotin",
        dosage: "2,500\u20135,000 mcg daily",
        reason: "Supports hair and nail strength."
      },
      {
        supplementId: "vitamin-c",
        dosage: "500 mg daily",
        reason: "Supports collagen production and antioxidant protection."
      }
    ]
  },
  {
    id: "longevity-aging",
    name: "Longevity & Healthy Aging Stack",
    description: "Long-term wellness stack for cellular resilience and healthy aging.",
    targetGender: "all",
    primaryGoal: "longevity",
    synergyDescription: "Resveratrol and green tea support cellular resilience, while CoQ10 and omega-3 promote cardiovascular and mitochondrial health.",
    ingredients: [
      {
        supplementId: "resveratrol",
        dosage: "100\u2013200 mg daily",
        reason: "Supports cellular longevity and antioxidant defense."
      },
      {
        supplementId: "green-tea-matcha",
        dosage: "1\u20132 cups daily",
        reason: "Provides polyphenols that support longevity."
      },
      {
        supplementId: "coq10",
        dosage: "100\u2013200 mg daily",
        reason: "Supports mitochondrial output and energy."
      },
      {
        supplementId: "omega-3",
        dosage: "1\u20132 g combined EPA/DHA daily",
        reason: "Supports heart and brain health."
      }
    ]
  },
  {
    id: "metabolic-balance",
    name: "Metabolic & Blood Sugar Stack",
    description: "Blood sugar support stack for metabolic balance and energy stability.",
    targetGender: "all",
    primaryGoal: "metabolic",
    synergyDescription: "Berberine and chromium support glucose metabolism, alpha-lipoic acid boosts antioxidant support, and magnesium supports insulin sensitivity.",
    ingredients: [
      {
        supplementId: "berberine",
        dosage: "500 mg 2\xD7 daily with meals",
        reason: "Supports healthy blood sugar and lipid balance."
      },
      {
        supplementId: "chromium",
        dosage: "200\u2013400 mcg daily",
        reason: "Supports healthy glucose metabolism."
      },
      {
        supplementId: "alpha-lipoic-acid",
        dosage: "300\u2013600 mg daily",
        reason: "Supports antioxidant defense and insulin sensitivity."
      },
      {
        supplementId: "magnesium",
        dosage: "300\u2013400 mg nightly",
        reason: "Supports insulin signaling and recovery."
      }
    ]
  },
  {
    id: "liver-detox",
    name: "Liver & Detox Support Stack",
    description: "Detox-focused stack for liver support and antioxidant balance.",
    targetGender: "all",
    primaryGoal: "detox",
    synergyDescription: "Milk thistle and NAC support glutathione production while turmeric and green tea provide antioxidant protection.",
    ingredients: [
      {
        supplementId: "milk-thistle",
        dosage: "150\u2013300 mg daily",
        reason: "Supports liver detoxification pathways."
      },
      {
        supplementId: "nac",
        dosage: "600\u20131,200 mg daily",
        reason: "Supports glutathione production and detoxification."
      },
      {
        supplementId: "turmeric-curcumin",
        dosage: "500\u20131,000 mg daily with food",
        reason: "Supports liver antioxidant defenses."
      },
      {
        supplementId: "green-tea-matcha",
        dosage: "1\u20132 cups daily",
        reason: "Provides polyphenols for detox support."
      }
    ]
  }
];

// src/data/semanticIntents.ts
var semanticIntentDataset = [
  {
    id: "sleep-recovery",
    text: "I wake up tired and need deeper sleep and recovery.",
    goals: ["sleep", "recovery", "stress"],
    systems: ["nervous", "hormonal"]
  },
  {
    id: "focus-productivity",
    text: "I need sharper focus and sustained concentration at work.",
    goals: ["focus", "energy", "brain-health"],
    systems: ["nervous"]
  },
  {
    id: "stress-burnout",
    text: "High stress, anxious, and feeling burned out lately.",
    goals: ["stress", "mood", "energy"],
    systems: ["nervous", "hormonal"]
  },
  {
    id: "immunity-seasonal",
    text: "I want stronger immunity during cold and flu season.",
    goals: ["immunity"],
    systems: ["immune"]
  },
  {
    id: "gut-bloat",
    text: "Digestive discomfort, bloating, and irregularity.",
    goals: ["digestion"],
    systems: ["digestive"]
  },
  {
    id: "joint-inflammation",
    text: "Joint pain, stiffness, and inflammation after workouts.",
    goals: ["joint", "recovery"],
    systems: ["musculoskeletal", "immune"]
  },
  {
    id: "heart-metabolic",
    text: "Looking to support heart health and metabolic balance.",
    goals: ["cardiovascular", "metabolic"],
    systems: ["cardiovascular", "metabolic"]
  },
  {
    id: "hormone-balance",
    text: "Need help with hormone balance and reproductive health.",
    goals: ["hormones", "reproductive", "libido"],
    systems: ["hormonal", "reproductive"]
  },
  {
    id: "fitness-performance",
    text: "Increase workout performance, strength, and endurance.",
    goals: ["fitness", "energy", "recovery"],
    systems: ["musculoskeletal", "cardiovascular"]
  },
  {
    id: "skin-hair",
    text: "Improve skin clarity and support hair and nails.",
    goals: ["skin", "hair"],
    systems: ["integumentary"]
  }
];

// src/utils/similarity.ts
var tokenizeText = (text) => {
  return text.toLowerCase().replace(/[^\w\s'-]/g, " ").split(/\s+/).map((token) => token.trim()).filter((token) => token.length > 1);
};
var buildTermFrequency = (tokens) => {
  const counts = /* @__PURE__ */ new Map();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return counts;
};
var cosineSimilarity = (a, b) => {
  let dot = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  for (const value of a.values()) {
    magnitudeA += value * value;
  }
  for (const value of b.values()) {
    magnitudeB += value * value;
  }
  for (const [term, value] of a.entries()) {
    const other = b.get(term);
    if (other) {
      dot += value * other;
    }
  }
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  return dot / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};
var rankByCosineSimilarity = (query, items, limit = 3) => {
  const queryTokens = tokenizeText(query);
  const queryVector = buildTermFrequency(queryTokens);
  return items.map((item) => {
    const itemVector = buildTermFrequency(tokenizeText(item.text));
    return { item, score: cosineSimilarity(queryVector, itemVector) };
  }).filter((result) => result.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
};

// src/data/supplementKnowledge.generated.ts
var supplementKnowledgeGenerated = {
  "5-htp": {
    "supplementId": "5-htp",
    "supplementName": "5-HTP (5-Hydroxytryptophan)",
    "aliases": [
      "5 htp",
      "5-HTP 5-Hydroxytryptophan",
      "5-Hydroxytryptophan"
    ],
    "categories": [
      "amino-acid"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "5-HTP has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "anxiety",
      "appetite",
      "depression",
      "migraine",
      "mood",
      "sleep"
    ],
    "safetyNotes": [
      "Can cause nausea.",
      "Potential medication interactions include: SSRIs (serotonin syndrome risk), MAOIs, Triptans.",
      "Serotonin syndrome risk if combined with SSRIs.",
      "Use clinician guidance with: On serotonergic medications, Carcinoid tumors, Scleroderma."
    ],
    "safetyFlags": [
      "drug-interaction"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements for Exercise and Athletic Performance",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "acetyl-l-carnitine": {
    "supplementId": "acetyl-l-carnitine",
    "supplementName": "Acetyl-L-Carnitine (ALCAR)",
    "aliases": [
      "acetyl l carnitine",
      "Acetyl-L-Carnitine ALCAR",
      "ALCAR"
    ],
    "categories": [
      "amino-acid"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Acetyl-L-Carnitine has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "anti aging",
      "brain health",
      "cognitive",
      "energy",
      "fat metabolism",
      "fertility",
      "mood"
    ],
    "safetyNotes": [
      "Can be stimulating.",
      "May cause fishy body odor in some.",
      "Potential medication interactions include: Blood thinners, Thyroid medications.",
      "Use clinician guidance with: Seizure disorders (may lower seizure threshold), Hypothyroidism."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk",
      "stimulant",
      "thyroid"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements for Exercise and Athletic Performance",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "alpha-gpc": {
    "supplementId": "alpha-gpc",
    "supplementName": "Alpha-GPC",
    "aliases": [],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Alpha-GPC has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "athletic performance",
      "choline",
      "cognition",
      "focus",
      "memory",
      "neuroprotection"
    ],
    "safetyNotes": [
      "Fishy body odor possible.",
      "May cause headache if acetylcholine too high.",
      "Potential medication interactions include: Anticholinergic drugs, Acetylcholinesterase inhibitors.",
      "Use clinician guidance with: Generally safe."
    ],
    "safetyFlags": [
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "alpha-lipoic-acid": {
    "supplementId": "alpha-lipoic-acid",
    "supplementName": "Alpha-Lipoic Acid (ALA)",
    "aliases": [
      "ALA",
      "alpha lipoic acid",
      "Alpha-Lipoic Acid ALA"
    ],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Alpha-Lipoic Acid has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "anti aging",
      "antioxidant",
      "blood sugar",
      "heavy metals",
      "nerve health",
      "neuropathy"
    ],
    "safetyNotes": [
      "May lower blood sugar significantly.",
      "Potential medication interactions include: Diabetes medications, Thyroid medications, Chemotherapy.",
      "R-ALA is more potent.",
      "Use clinician guidance with: Thiamine (B1) deficiency."
    ],
    "safetyFlags": [
      "blood-sugar",
      "thyroid"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "amla": {
    "supplementId": "amla",
    "supplementName": "Amla / Amalaki (Emblica officinalis)",
    "aliases": [
      "Amalaki (Emblica officinalis)",
      "Amalaki Emblica officinalis",
      "amla",
      "Amla / Amalaki",
      "Amla / Amalaki Emblica officinalis",
      "Emblica officinalis"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging",
      "traditional"
    ],
    "evidenceSummary": "Amla / Amalaki has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "antioxidant",
      "hair",
      "immunity",
      "liver",
      "longevity",
      "skin",
      "vitamin c"
    ],
    "safetyNotes": [
      "Potential medication interactions include: May enhance absorption of iron, Blood thinners (high vitamin C).",
      "Use clinician guidance with: Generally very safe for all.",
      "Very sour taste - may need to combine with other flavors."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "andrographis": {
    "supplementId": "andrographis",
    "supplementName": "Andrographis (Kalmegh/King of Bitters)",
    "aliases": [
      "andrographis",
      "Andrographis (Kalmegh",
      "Andrographis Kalmegh/King of Bitters",
      "Kalmegh/King of Bitters",
      "King of Bitters",
      "King of Bitters)"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Andrographis has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "cold",
      "fever",
      "flu",
      "immunity",
      "infection"
    ],
    "safetyNotes": [
      "Bitter taste can linger.",
      "Can cause gastric upset.",
      "Potential medication interactions include: Blood pressure meds, Immunosuppressants, Blood thinners.",
      "Use clinician guidance with: Autoimmune conditions, Gallbladder disease, Pregnancy (abortifacient effects)."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "bleeding-risk",
      "blood-pressure"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "apigenin": {
    "supplementId": "apigenin",
    "supplementName": "Apigenin",
    "aliases": [],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Apigenin has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "anxiety",
      "calm",
      "prostate",
      "sleep"
    ],
    "safetyNotes": [
      "Potential medication interactions include: Sedatives, Blood thinners.",
      "Safe at recommended doses.",
      "Use clinician guidance with: Pregnancy (lack of data)."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "bleeding-risk",
      "sedation"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "arjuna": {
    "supplementId": "arjuna",
    "supplementName": "Arjuna (Terminalia arjuna)",
    "aliases": [
      "arjuna",
      "Arjuna Terminalia arjuna",
      "Terminalia arjuna"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging",
      "traditional"
    ],
    "evidenceSummary": "Arjuna has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "blood pressure",
      "cardiac",
      "cholesterol",
      "circulation",
      "heart health"
    ],
    "safetyNotes": [
      "May enhance effects of heart medications.",
      "Potential medication interactions include: Blood pressure medications, Cardiac glycosides, Blood thinners.",
      "Use clinician guidance with: Consult doctor if on any heart medications."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk",
      "blood-pressure"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "ashwagandha": {
    "supplementId": "ashwagandha",
    "supplementName": "Ashwagandha (Withania somnifera)",
    "aliases": [
      "ashwaganda",
      "ashwagandha",
      "Ashwagandha Withania somnifera",
      "ashwaghanda",
      "ksm 66",
      "sensoril",
      "withania somnifera"
    ],
    "categories": [
      "adaptogen",
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Human trials suggest possible benefits for stress and sleep outcomes, but study size, extracts, and endpoints vary.",
    "typicalUseCases": [
      "anxiety",
      "calm focus",
      "cortisol",
      "energy",
      "fertility",
      "libido",
      "male reproductive",
      "muscle"
    ],
    "safetyNotes": [
      "Can be overly sedating for some.",
      "May cause mild GI upset initially.",
      "Potential medication interactions can include thyroid, sedative, blood pressure, or immune-modulating therapies.",
      "Potential medication interactions include: Thyroid medications, Immunosuppressants, Sedatives.",
      "Pregnancy and breastfeeding use should be clinician-guided due to limited safety data."
    ],
    "safetyFlags": [
      "pregnancy",
      "breastfeeding",
      "drug-interaction",
      "blood-pressure",
      "sedation",
      "thyroid",
      "liver",
      "autoimmune"
    ],
    "dosageRangeNote": "Commonly studied extracts are often used in the low hundreds of milligrams per day depending on standardization.",
    "citations": [
      {
        "title": "Ashwagandha",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/ashwagandha",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "NCCIH: Ashwagandha",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/ashwagandha",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "astaxanthin": {
    "supplementId": "astaxanthin",
    "supplementName": "Astaxanthin",
    "aliases": [],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Astaxanthin has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "antioxidant",
      "eyes",
      "inflammation",
      "recovery",
      "skin",
      "sun protection",
      "wrinkles"
    ],
    "safetyNotes": [
      "May turn skin slightly orange at very high doses (harmless).",
      "Potential medication interactions include: None significant.",
      "Use clinician guidance with: Generally safe for all."
    ],
    "safetyFlags": [
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "b-complex": {
    "supplementId": "b-complex",
    "supplementName": "Vitamin B Complex",
    "aliases": [
      "b complex",
      "b vitamins",
      "vitamin b complex"
    ],
    "categories": [
      "vitamin"
    ],
    "evidenceStrengthTags": [
      "well-supported",
      "mixed"
    ],
    "evidenceSummary": "B-complex products combine several B vitamins; benefits are usually strongest when intake is insufficient or requirements are increased.",
    "typicalUseCases": [
      "brain health",
      "dietary gap support",
      "energy",
      "energy metabolism support",
      "metabolism",
      "mood",
      "nervous system",
      "nervous system support"
    ],
    "safetyNotes": [
      "High B6 (pyridoxine HCl) can cause nerve issues long-term; prefer P-5-P (pyridoxal-5-phosphate).",
      "High-dose B-complex products can exceed tolerable intake levels for some components (for example, niacin or vitamin B6) when stacked with other products.",
      "May cause bright yellow urine (normal - riboflavin).",
      "Potential medication interactions include: Some antibiotics, Seizure medications, Methotrexate.",
      "Use clinician guidance with: Generally safe for most."
    ],
    "safetyFlags": [
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Folate - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Folate-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Niacin - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Niacin-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Pantothenic Acid - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/PantothenicAcid-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Riboflavin - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Riboflavin-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Thiamin - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Thiamin-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Vitamin B12 - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Vitamin B6 - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/VitaminB6-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "beetroot-extract": {
    "supplementId": "beetroot-extract",
    "supplementName": "Beetroot Extract / Nitrates",
    "aliases": [
      "beetroot extract",
      "Nitrates"
    ],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Beetroot Extract / Nitrates has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "blood flow",
      "blood pressure",
      "cycling",
      "endurance",
      "exercise",
      "running"
    ],
    "safetyNotes": [
      "High oxalate content.",
      "May turn urine/stool pink (harmless).",
      "Potential medication interactions include: Blood pressure medications, ED medications.",
      "Use clinician guidance with: Kidney stone history, Very low blood pressure."
    ],
    "safetyFlags": [
      "blood-pressure",
      "kidney"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "berberine": {
    "supplementId": "berberine",
    "supplementName": "Berberine",
    "aliases": [],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Berberine has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "ampk",
      "blood sugar",
      "cholesterol",
      "diabetes",
      "longevity",
      "metabolism",
      "weight"
    ],
    "safetyNotes": [
      "Can cause GI upset initially.",
      "May lower blood sugar significantly.",
      "Potential medication interactions include: Many medications (affects CYP enzymes), Metformin, Blood thinners.",
      "Use clinician guidance with: Pregnancy, Breastfeeding, On multiple medications (consult doctor)."
    ],
    "safetyFlags": [
      "pregnancy",
      "breastfeeding",
      "drug-interaction",
      "bleeding-risk",
      "blood-pressure",
      "blood-sugar"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "beta-alanine": {
    "supplementId": "beta-alanine",
    "supplementName": "Beta-Alanine",
    "aliases": [],
    "categories": [
      "amino-acid"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Beta-Alanine has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "athletic performance",
      "crossfit",
      "endurance",
      "fatigue",
      "high intensity",
      "hiit"
    ],
    "safetyNotes": [
      "Paresthesia (tingling) is harmless but can be uncomfortable.",
      "Potential medication interactions include: May interact with heart medications affecting taurine.",
      "Use clinician guidance with: Generally safe for all."
    ],
    "safetyFlags": [
      "drug-interaction"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements for Exercise and Athletic Performance",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "biotin": {
    "supplementId": "biotin",
    "supplementName": "Biotin (Vitamin B7)",
    "aliases": [
      "biotin",
      "Biotin Vitamin B7",
      "biotine",
      "vit b7",
      "vitamin b7",
      "vitamin h"
    ],
    "categories": [
      "vitamin"
    ],
    "evidenceStrengthTags": [
      "well-supported",
      "mixed"
    ],
    "evidenceSummary": "Biotin is required for carboxylase enzyme function; deficiency is uncommon in the general population.",
    "typicalUseCases": [
      "beauty",
      "dietary gap support",
      "hair and nail support",
      "hair loss",
      "nails",
      "skin"
    ],
    "safetyNotes": [
      "CRITICAL: Interferes with 30+ lab tests including troponin, thyroid panels, tumor markers, and hormone assays; can cause false results.",
      "High-dose biotin can interfere with some laboratory tests, including certain thyroid and cardiac biomarkers.",
      "Potential medication interactions include: Anticonvulsants.",
      "Use clinician guidance with: Stop 5-7 days before ANY blood work and notify your clinician."
    ],
    "safetyFlags": [
      "thyroid",
      "general-caution"
    ],
    "dosageRangeNote": "Adult adequate intake is commonly listed as 30 mcg/day, with much higher doses used only in selected contexts.",
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Biotin - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Biotin-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "black-pepper": {
    "supplementId": "black-pepper",
    "supplementName": "Black Pepper Extract (Piperine)",
    "aliases": [
      "black pepper",
      "Black Pepper Extract",
      "Black Pepper Extract Piperine",
      "Piperine"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Black Pepper Extract has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "absorption",
      "digestion",
      "inflammation"
    ],
    "safetyNotes": [
      "Can irritate stomach in some.",
      "May increase absorption of medications.",
      "Potential medication interactions include: Many medications (can increase absorption), Blood thinners.",
      "Use clinician guidance with: Active ulcers or GERD flare-ups."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "black-tea-assam": {
    "supplementId": "black-tea-assam",
    "supplementName": "Black Tea - Assam (Camellia sinensis)",
    "aliases": [
      "Black Tea - Assam Camellia sinensis",
      "black tea assam",
      "Camellia sinensis"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Black Tea - Assam has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "antioxidant",
      "energy",
      "focus",
      "heart health"
    ],
    "safetyNotes": [
      "Higher caffeine content may cause jitters or insomnia.",
      "Potential medication interactions include: Stimulants (additive caffeine).",
      "Use clinician guidance with: Severe caffeine sensitivity."
    ],
    "safetyFlags": [
      "stimulant"
    ],
    "citations": [
      {
        "title": "Black Tea - Healthline",
        "publisher": "healthline.com",
        "url": "https://www.healthline.com/nutrition/black-tea-benefits",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Black Tea Benefits - PMC",
        "publisher": "National Institutes of Health",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6512146",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "boron": {
    "supplementId": "boron",
    "supplementName": "Boron",
    "aliases": [
      "bor",
      "borate"
    ],
    "categories": [
      "mineral"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Boron is a trace element with emerging evidence in bone and mineral metabolism, but clinical endpoints remain limited.",
    "typicalUseCases": [
      "bone health",
      "bone support",
      "inflammation",
      "joints",
      "libido",
      "testosterone",
      "trace mineral support"
    ],
    "safetyNotes": [
      "High doses (20mg+) not recommended long term.",
      "No RDA has been established, so conservative dosing and product quality review are important.",
      "None at recommended doses.",
      "Potential medication interactions include: Estrogen-containing drugs.",
      "Use clinician guidance with: Hormone-sensitive conditions (due to estrogen increase potential)."
    ],
    "safetyFlags": [
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Boron - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Boron-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "boswellia": {
    "supplementId": "boswellia",
    "supplementName": "Boswellia / Shallaki (Boswellia serrata)",
    "aliases": [
      "boswellia",
      "Boswellia / Shallaki",
      "Boswellia / Shallaki Boswellia serrata",
      "boswellia serrata",
      "frankincense",
      "Shallaki (Boswellia serrata)",
      "Shallaki Boswellia serrata"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Boswellia shows mixed evidence for joint comfort and inflammation-related outcomes, with effect size varying by extract quality.",
    "typicalUseCases": [
      "arthritis",
      "gut health",
      "inflammation",
      "joint comfort support",
      "joint pain",
      "mobility",
      "mobility support"
    ],
    "safetyNotes": [
      "Gastrointestinal effects are possible, and medication interaction review is advisable before long-term use.",
      "May cause GI upset or acid reflux in some.",
      "Potential medication interactions include: NSAIDs (may enhance), Blood thinners.",
      "Use clinician guidance with: Pregnancy, Breastfeeding."
    ],
    "safetyFlags": [
      "pregnancy",
      "breastfeeding",
      "drug-interaction",
      "bleeding-risk",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Boswellia: Usefulness and Safety",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/boswellia",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "brahmi": {
    "supplementId": "brahmi",
    "supplementName": "Brahmi (Bacopa monnieri)",
    "aliases": [
      "Bacopa monnieri",
      "brahmi",
      "Brahmi Bacopa monnieri"
    ],
    "categories": [
      "adaptogen",
      "herb"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Brahmi has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "brain health",
      "cognition",
      "focus",
      "memory",
      "stress"
    ],
    "safetyNotes": [
      "Can be mildly sedating for some.",
      "May cause GI upset initially.",
      "Potential medication interactions include: Thyroid medications, Anticholinergics, Sedatives.",
      "Use clinician guidance with: Pregnancy, Bradycardia."
    ],
    "safetyFlags": [
      "pregnancy",
      "sedation",
      "thyroid"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "brahmi-bacopa": {
    "supplementId": "brahmi-bacopa",
    "supplementName": "Brahmi / Bacopa monnieri",
    "aliases": [
      "bacopa monnieri",
      "bakoopa",
      "brahmi",
      "brahmi bacopa"
    ],
    "categories": [
      "adaptogen",
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Brahmi / Bacopa monnieri has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "anxiety",
      "brain health",
      "cognition",
      "focus",
      "focus support",
      "learning",
      "memory",
      "memory support"
    ],
    "safetyNotes": [
      "Can be mildly sedating for some.",
      "May cause GI upset initially - start low.",
      "Potential medication interactions include: Thyroid medications, Calcium channel blockers, Anticholinergic drugs.",
      "Use clinician guidance with: Pregnancy, Breastfeeding, Slow heart rate (bradycardia)."
    ],
    "safetyFlags": [
      "pregnancy",
      "breastfeeding",
      "sedation",
      "thyroid",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "caffeine": {
    "supplementId": "caffeine",
    "supplementName": "Caffeine",
    "aliases": [],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Caffeine has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "alertness",
      "endurance",
      "energy",
      "fat burning",
      "focus",
      "performance"
    ],
    "safetyNotes": [
      "Anxiety in sensitive individuals.",
      "Disrupts sleep if taken late.",
      "Potential medication interactions include: MAOIs, Stimulants, Bronchodilators.",
      "Use clinician guidance with: Anxiety disorders, Heart arrhythmias, Insomnia."
    ],
    "safetyFlags": [
      "drug-interaction",
      "stimulant"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "calcium": {
    "supplementId": "calcium",
    "supplementName": "Calcium",
    "aliases": [
      "ca",
      "calcium carbonate",
      "calcium citrate"
    ],
    "categories": [
      "mineral"
    ],
    "evidenceStrengthTags": [
      "well-supported",
      "mixed"
    ],
    "evidenceSummary": "Calcium is essential for bone and neuromuscular function, and supplementation is most useful when dietary intake is below targets.",
    "typicalUseCases": [
      "bone health",
      "bone health support",
      "muscle function",
      "muscle function support",
      "osteoporosis"
    ],
    "safetyNotes": [
      "Don't exceed 1200mg daily total.",
      "High supplemental intake can increase adverse-effect risk, including constipation and kidney stone risk in susceptible individuals.",
      "Potential medication interactions include: Thyroid medications, Bisphosphonates, Some antibiotics.",
      "Use clinician guidance with: Hypercalcemia, Kidney stones (consult doctor), Hyperparathyroidism.",
      "Without K2 and D3, may calcify arteries."
    ],
    "safetyFlags": [
      "thyroid",
      "kidney",
      "general-caution"
    ],
    "dosageRangeNote": "Total daily intake goals are often around 1,000-1,200 mg/day from food plus supplements, with divided doses improving tolerance.",
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Calcium - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Calcium-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "chaga": {
    "supplementId": "chaga",
    "supplementName": "Chaga (Inonotus obliquus)",
    "aliases": [
      "chaga",
      "Chaga Inonotus obliquus",
      "Inonotus obliquus"
    ],
    "categories": [
      "mushroom"
    ],
    "evidenceStrengthTags": [
      "emerging"
    ],
    "evidenceSummary": "Chaga is informed by traditional use and emerging research, while higher-quality clinical evidence remains limited.",
    "typicalUseCases": [
      "antioxidant",
      "immunity",
      "inflammation",
      "longevity"
    ],
    "safetyNotes": [
      "High in oxalates.",
      "May affect blood clotting.",
      "Potential medication interactions include: Blood thinners, Diabetes medications.",
      "Use clinician guidance with: Kidney stones (oxalates), Bleeding disorders."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk",
      "blood-sugar",
      "kidney"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "chamomile-tea": {
    "supplementId": "chamomile-tea",
    "supplementName": "Chamomile (Matricaria chamomilla)",
    "aliases": [
      "chamomile",
      "Chamomile Matricaria chamomilla",
      "chamomile tea",
      "german chamomile tea",
      "Matricaria chamomilla",
      "matricaria recutita"
    ],
    "categories": [
      "herb",
      "tea"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Chamomile has limited evidence for relaxation and anxiety-related outcomes, with generally mild effects when present.",
    "typicalUseCases": [
      "anxiety",
      "digestion",
      "digestive comfort",
      "relaxation support",
      "sleep",
      "sleep wind down",
      "stress"
    ],
    "safetyNotes": [
      "Allergic reactions are more likely in people sensitive to ragweed-related plants.",
      "Evidence strongest for sleep quality and GAD rather than acute anxiety relief.",
      "May cause allergic reactions in those sensitive to ragweed family.",
      "Possible interactions include sedatives and anticoagulants.",
      "Potential medication interactions include: Sedatives, Blood thinners."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "bleeding-risk",
      "sedation"
    ],
    "citations": [
      {
        "title": "Chamomile: Usefulness and Safety",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/chamomile",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "chlorella": {
    "supplementId": "chlorella",
    "supplementName": "Chlorella",
    "aliases": [],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "emerging"
    ],
    "evidenceSummary": "Chlorella is informed by traditional use and emerging research, while higher-quality clinical evidence remains limited.",
    "typicalUseCases": [
      "detox",
      "digestion",
      "immunity",
      "longevity"
    ],
    "safetyNotes": [
      "May cause green stools.",
      "Potential medication interactions include: Blood thinners, Immunosuppressants.",
      "Start low to avoid GI upset.",
      "Use clinician guidance with: Autoimmune conditions (use caution)."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk",
      "autoimmune"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "chromium": {
    "supplementId": "chromium",
    "supplementName": "Chromium",
    "aliases": [
      "chromium picolinate",
      "chromium polynicotinate",
      "cr"
    ],
    "categories": [
      "mineral"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Chromium has mixed evidence for metabolic outcomes, with effects varying across populations and formulations.",
    "typicalUseCases": [
      "blood sugar",
      "blood sugar support",
      "energy",
      "metabolic support",
      "metabolism",
      "weight"
    ],
    "safetyNotes": [
      "Monitor blood sugar if diabetic.",
      "Potential benefits and risks should be reviewed when used with glucose-lowering medications.",
      "Potential medication interactions include: Insulin, Diabetes medications.",
      "Use clinician guidance with: Kidney disease (high-dose caution)."
    ],
    "safetyFlags": [
      "drug-interaction",
      "blood-sugar",
      "kidney",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Chromium - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Chromium-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "chyawanprash": {
    "supplementId": "chyawanprash",
    "supplementName": "Chyawanprash",
    "aliases": [],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging",
      "traditional"
    ],
    "evidenceSummary": "Chyawanprash has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "antioxidant",
      "immunity",
      "longevity",
      "rejuvenation",
      "respiratory",
      "vitality"
    ],
    "safetyNotes": [
      "Contains sugar/honey - diabetics should use sugar-free versions.",
      "Potential medication interactions include: Generally safe, but check with practitioner if on medications.",
      "Quality varies by brand.",
      "Use clinician guidance with: Diabetes (regular versions), Acute fever or infection."
    ],
    "safetyFlags": [
      "blood-sugar"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "cinnamon-tea": {
    "supplementId": "cinnamon-tea",
    "supplementName": "Cinnamon (Cinnamomum verum/cassia)",
    "aliases": [
      "cassia",
      "cassia)",
      "Cinnamomum verum/cassia",
      "Cinnamon",
      "Cinnamon (Cinnamomum verum",
      "Cinnamon Cinnamomum verum/cassia",
      "cinnamon tea"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Cinnamon has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "antioxidant",
      "blood sugar",
      "digestion",
      "metabolism"
    ],
    "safetyNotes": [
      "Cassia cinnamon contains more coumarin; avoid excessive long-term high doses.",
      "Potential medication interactions include: Diabetes medications, Blood thinners.",
      "Use clinician guidance with: Liver disease (limit cassia cinnamon), Pregnancy (high-dose use)."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "bleeding-risk",
      "blood-sugar",
      "liver"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "citrulline": {
    "supplementId": "citrulline",
    "supplementName": "Citrulline (L-Citrulline)",
    "aliases": [
      "citrulline",
      "Citrulline L-Citrulline",
      "L-Citrulline"
    ],
    "categories": [
      "amino-acid"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Citrulline has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "blood flow",
      "endurance",
      "erectile function",
      "performance",
      "pump",
      "sexual health"
    ],
    "safetyNotes": [
      "May cause mild GI upset at high doses.",
      "Potential medication interactions include: Blood pressure medications, Nitrates, ED medications.",
      "Use clinician guidance with: Low blood pressure, On nitrate medications."
    ],
    "safetyFlags": [
      "blood-pressure"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements for Exercise and Athletic Performance",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "collagen": {
    "supplementId": "collagen",
    "supplementName": "Collagen Peptides",
    "aliases": [
      "collagen"
    ],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Collagen Peptides has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "gut lining",
      "hair",
      "joints",
      "nails",
      "recovery",
      "skin",
      "tendons",
      "wrinkles"
    ],
    "safetyNotes": [
      "Generally very safe.",
      "Potential medication interactions include: None significant.",
      "Source matters (marine, bovine, etc.).",
      "Use clinician guidance with: Specific allergies to source animal."
    ],
    "safetyFlags": [
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "copper": {
    "supplementId": "copper",
    "supplementName": "Copper",
    "aliases": [
      "copper bisglycinate",
      "copper gluconate",
      "cu"
    ],
    "categories": [
      "mineral"
    ],
    "evidenceStrengthTags": [
      "well-supported",
      "mixed"
    ],
    "evidenceSummary": "Copper is required for iron metabolism, connective tissue biology, and antioxidant enzymes.",
    "typicalUseCases": [
      "anemia",
      "collagen",
      "energy",
      "grey hair",
      "iron metabolism support",
      "skin",
      "trace mineral balance"
    ],
    "safetyNotes": [
      "Excess copper intake can cause toxicity, and long-term high intake should be avoided without clinical indication.",
      "Potential medication interactions include: Birth control pills (increase copper), NSAIDs.",
      "Toxic in excess.",
      "Use clinician guidance with: Wilson's Disease (copper accumulation disorder).",
      "Zinc supplements deplete copper."
    ],
    "safetyFlags": [
      "liver",
      "general-caution"
    ],
    "dosageRangeNote": "Adult RDA is typically 900 mcg/day; upper intake limits should be respected in multi-supplement plans.",
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Copper - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Copper-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "coq10": {
    "supplementId": "coq10",
    "supplementName": "CoQ10 (Ubiquinol)",
    "aliases": [
      "coq10",
      "CoQ10 Ubiquinol",
      "Ubiquinol"
    ],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "CoQ10 has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "anti aging",
      "energy",
      "fertility",
      "heart health",
      "migraine",
      "mitochondria",
      "sexual health",
      "sperm motility"
    ],
    "safetyNotes": [
      "Potential medication interactions include: Blood thinners, Blood pressure medications, Chemotherapy.",
      "Ubiquinol is better absorbed than ubiquinone, especially over age 40.",
      "Use clinician guidance with: Generally safe. Consult doctor if on blood thinners."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk",
      "blood-pressure"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "cordyceps": {
    "supplementId": "cordyceps",
    "supplementName": "Cordyceps (Cordyceps militaris)",
    "aliases": [
      "cordyceps",
      "Cordyceps Cordyceps militaris",
      "Cordyceps militaris"
    ],
    "categories": [
      "adaptogen",
      "mushroom"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Cordyceps has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "athletic performance",
      "endurance",
      "energy",
      "libido",
      "respiratory",
      "stamina"
    ],
    "safetyNotes": [
      "May be too stimulating for some.",
      "Potential medication interactions include: Blood thinners, Immunosuppressants, Diabetes medications.",
      "Use clinician guidance with: Autoimmune conditions (may stimulate immunity), Bleeding disorders."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk",
      "blood-sugar",
      "stimulant"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "creatine": {
    "supplementId": "creatine",
    "supplementName": "Creatine Monohydrate",
    "aliases": [
      "creatin",
      "creatine",
      "creatine mono",
      "creatine monohydrate"
    ],
    "categories": [
      "amino-acid",
      "performance"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Creatine monohydrate is one of the best-studied performance supplements for high-intensity output and lean mass support.",
    "typicalUseCases": [
      "athletic performance",
      "brain health",
      "cognitive",
      "muscle",
      "power",
      "power output",
      "recovery",
      "strength"
    ],
    "safetyNotes": [
      "Hydration and total dose planning should match individual training context.",
      "May cause water retention initially.",
      "Potential medication interactions include: Nephrotoxic drugs (kidney concern).",
      "Stay hydrated.",
      "Use clinician guidance with: Pre-existing kidney disease (consult doctor)."
    ],
    "safetyFlags": [
      "kidney",
      "general-caution"
    ],
    "citations": [
      {
        "title": "ISSN Position Stand: Creatine Supplementation",
        "publisher": "jissn.biomedcentral.com",
        "url": "https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0173-z",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements for Exercise and Athletic Performance",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "dark-tea-pu-erh-sheng": {
    "supplementId": "dark-tea-pu-erh-sheng",
    "supplementName": "Dark Tea - Pu-erh Sheng (Raw) (Camellia sinensis)",
    "aliases": [
      "Camellia sinensis",
      "Dark Tea - Pu-erh Sheng Raw Camellia sinensis",
      "dark tea pu erh sheng",
      "Raw"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Dark Tea - Pu-erh Sheng has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "cholesterol",
      "digestion",
      "metabolism",
      "weight"
    ],
    "safetyNotes": [
      "Contains caffeine.",
      "Potential medication interactions include: Stimulants (additive caffeine).",
      "Use clinician guidance with: Severe caffeine sensitivity."
    ],
    "safetyFlags": [
      "stimulant"
    ],
    "citations": [
      {
        "title": "Pu-erh Benefits - Healthline",
        "publisher": "healthline.com",
        "url": "https://www.healthline.com/health/food-nutrition/pu-erh-tea-benefits",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Pu-erh Nervous System - PMC",
        "publisher": "National Institutes of Health",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5533841",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "decaf-tea": {
    "supplementId": "decaf-tea",
    "supplementName": "Decaf Tea (Camellia sinensis)",
    "aliases": [
      "Camellia sinensis",
      "decaf tea",
      "Decaf Tea Camellia sinensis"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Decaf Tea has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "antioxidant",
      "heart health",
      "metabolism"
    ],
    "safetyNotes": [
      "Potential medication interactions include: Stimulants (minimal but possible additive caffeine).",
      "Small residual caffeine may remain.",
      "Use clinician guidance with: Severe caffeine sensitivity (check decaf processing)."
    ],
    "safetyFlags": [
      "stimulant"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Decaf Green Tea Extract - PMC",
        "publisher": "National Institutes of Health",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7996723",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Tea - Harvard Nutrition Source",
        "publisher": "nutritionsource.hsph.harvard.edu",
        "url": "https://nutritionsource.hsph.harvard.edu/food-features/tea",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "digestive-enzymes": {
    "supplementId": "digestive-enzymes",
    "supplementName": "Digestive Enzymes (Broad Spectrum)",
    "aliases": [
      "Broad Spectrum",
      "digestive enzymes",
      "Digestive Enzymes Broad Spectrum"
    ],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Digestive Enzymes has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "bloating",
      "digestion",
      "gut health",
      "ibs"
    ],
    "safetyNotes": [
      "Do not use if you have Gastritis/Ulcers (protease can irritate).",
      "Potential medication interactions include: Blood thinners (if high in bromelain).",
      "Use clinician guidance with: Active stomach ulcers."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "dim": {
    "supplementId": "dim",
    "supplementName": "DIM (Diindolylmethane)",
    "aliases": [
      "Diindolylmethane",
      "dim",
      "DIM Diindolylmethane"
    ],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "DIM has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "acne",
      "estrogen",
      "hormonal balance",
      "menopause",
      "pms"
    ],
    "safetyNotes": [
      "Headache initially (detox).",
      "May turn urine orange/dark.",
      "Potential medication interactions include: Hormone replacement therapy, Oral contraceptives.",
      "Use clinician guidance with: Pregnancy, Breastfeeding."
    ],
    "safetyFlags": [
      "pregnancy",
      "breastfeeding"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "dittany-of-crete": {
    "supplementId": "dittany-of-crete",
    "supplementName": "Dittany of Crete (Origanum dictamnus)",
    "aliases": [
      "dittany of crete",
      "Dittany of Crete Origanum dictamnus",
      "Origanum dictamnus"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "emerging"
    ],
    "evidenceSummary": "Dittany of Crete is informed by traditional use and emerging research, while higher-quality clinical evidence remains limited.",
    "typicalUseCases": [
      "digestion",
      "immunity",
      "pms",
      "respiratory"
    ],
    "safetyNotes": [
      "Avoid during pregnancy (traditional uterine stimulant history).",
      "May have mild blood-thinning effect.",
      "Potential medication interactions include: Blood thinners (use with caution).",
      "Use clinician guidance with: Pregnancy."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "bleeding-risk",
      "stimulant"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "earl-grey-tea": {
    "supplementId": "earl-grey-tea",
    "supplementName": "Earl Grey (Bergamot Black Tea)",
    "aliases": [
      "Bergamot Black Tea",
      "Earl Grey",
      "Earl Grey Bergamot Black Tea",
      "earl grey tea"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Earl Grey has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "antioxidant",
      "focus",
      "heart health",
      "mood"
    ],
    "safetyNotes": [
      "Contains caffeine.",
      "Potential medication interactions include: Stimulants (additive caffeine).",
      "Use clinician guidance with: Severe caffeine sensitivity."
    ],
    "safetyFlags": [
      "stimulant"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Earl Grey Benefits - WebMD",
        "publisher": "webmd.com",
        "url": "https://www.webmd.com/diet/earl-grey-tea-is-it-good-for-you",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "echinacea": {
    "supplementId": "echinacea",
    "supplementName": "Echinacea",
    "aliases": [
      "echinacea purpurea",
      "echinacia",
      "purple coneflower"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Echinacea may modestly reduce common-cold risk in some studies, while effects on symptom duration are less consistent.",
    "typicalUseCases": [
      "cold",
      "flu",
      "immunity",
      "infection",
      "prevention",
      "seasonal immune support",
      "upper respiratory support"
    ],
    "safetyNotes": [
      "Allergic reactions can occur, particularly in people sensitive to ragweed-related plants.",
      "May cause allergic reactions in people allergic to ragweed family.",
      "Potential interactions with immunomodulating therapies should be reviewed clinically.",
      "Potential medication interactions include: Immunosuppressants, Liver-metabolized medications.",
      "Use clinician guidance with: Autoimmune conditions, Progressive systemic diseases (MS, TB, HIV), Ragweed allergy."
    ],
    "safetyFlags": [
      "drug-interaction",
      "liver",
      "autoimmune",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Echinacea: Usefulness and Safety",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/echinacea",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "elderberry": {
    "supplementId": "elderberry",
    "supplementName": "Elderberry (Sambucus nigra)",
    "aliases": [
      "elder berry",
      "elderberry",
      "Elderberry Sambucus nigra",
      "sambucus",
      "sambucus nigra"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Elderberry evidence for respiratory symptom outcomes is limited and product-specific, with variable trial quality.",
    "typicalUseCases": [
      "antiviral",
      "cold",
      "flu",
      "immunity",
      "respiratory",
      "respiratory comfort support",
      "seasonal immune support"
    ],
    "safetyNotes": [
      "Potential medication interactions include: Immunosuppressants, Diabetes medications.",
      "Raw berries are toxic - only use properly prepared products.",
      "Raw or unripe elderberry plant material can be toxic; use properly prepared commercial products.",
      "Use clinician guidance with: Autoimmune conditions (may stimulate immune system), During cytokine storm concerns."
    ],
    "safetyFlags": [
      "drug-interaction",
      "blood-sugar",
      "stimulant",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Elderberry: Usefulness and Safety",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/elderberry",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "english-breakfast-tea": {
    "supplementId": "english-breakfast-tea",
    "supplementName": "English Breakfast (Black Tea Blend)",
    "aliases": [
      "Black Tea Blend",
      "English Breakfast",
      "English Breakfast Black Tea Blend",
      "english breakfast tea"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "English Breakfast has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "antioxidant",
      "energy",
      "focus",
      "heart health"
    ],
    "safetyNotes": [
      "Contains caffeine.",
      "Potential medication interactions include: Stimulants (additive caffeine).",
      "Use clinician guidance with: Severe caffeine sensitivity."
    ],
    "safetyFlags": [
      "stimulant"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Black Tea Benefits - PMC",
        "publisher": "National Institutes of Health",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6512146",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "fenugreek": {
    "supplementId": "fenugreek",
    "supplementName": "Fenugreek (Methi)",
    "aliases": [
      "fenugreek",
      "Fenugreek Methi",
      "methi",
      "trigonella foenum graecum"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Fenugreek has mixed evidence for glycemic and other outcomes, with heterogeneity across studies and preparations.",
    "typicalUseCases": [
      "appetite support",
      "blood sugar",
      "digestion",
      "fertility",
      "lactation",
      "libido",
      "male reproductive",
      "metabolic support"
    ],
    "safetyNotes": [
      "Blood sugar effects significant.",
      "Fenugreek may lower blood glucose and can interact with medications affecting glucose or coagulation.",
      "May cause maple syrup body odor.",
      "Potential medication interactions include: Diabetes medications, Blood thinners.",
      "Pregnancy use should be clinically reviewed before supplementation."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "bleeding-risk",
      "blood-sugar"
    ],
    "citations": [
      {
        "title": "Fenugreek: Usefulness and Safety",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/fenugreek",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "folate": {
    "supplementId": "folate",
    "supplementName": "Folate (L-Methylfolate / 5-MTHF)",
    "aliases": [
      "5-MTHF",
      "5-MTHF)",
      "b9",
      "folat",
      "folate",
      "Folate (L-Methylfolate",
      "Folate L-Methylfolate / 5-MTHF",
      "folic acid",
      "L-Methylfolate / 5-MTHF",
      "vitamin b9"
    ],
    "categories": [
      "vitamin"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Folate is essential for DNA synthesis and fetal neural tube development; preconception intake guidance is strongly established.",
    "typicalUseCases": [
      "brain health",
      "homocysteine",
      "methylation",
      "methylation support",
      "mood",
      "preconception support",
      "pregnancy"
    ],
    "safetyNotes": [
      "High folic acid intake can mask hematologic signs of vitamin B12 deficiency.",
      "High-dose folate should be clinician-guided (e.g., prior NTD).",
      "May mask B12 deficiency at high doses.",
      "Potential medication interactions include: Methotrexate, Seizure medications, Some antibiotics.",
      "Use clinician guidance with: Generally safe. Consult doctor if on methotrexate or seizure medications."
    ],
    "safetyFlags": [
      "pregnancy",
      "general-caution"
    ],
    "citations": [
      {
        "title": "About Folic Acid",
        "publisher": "Centers for Disease Control and Prevention",
        "url": "https://www.cdc.gov/folic-acid/about/index.html",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Folate - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Folate-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "gaba": {
    "supplementId": "gaba",
    "supplementName": "GABA (Gamma-Aminobutyric Acid)",
    "aliases": [
      "gaba",
      "GABA Gamma-Aminobutyric Acid",
      "Gamma-Aminobutyric Acid"
    ],
    "categories": [
      "amino-acid"
    ],
    "evidenceStrengthTags": [
      "emerging"
    ],
    "evidenceSummary": "GABA is informed by traditional use and emerging research, while higher-quality clinical evidence remains limited.",
    "typicalUseCases": [
      "anxiety",
      "calm",
      "sleep",
      "stress"
    ],
    "safetyNotes": [
      "Effectiveness varies; may not cross blood-brain barrier well.",
      "Potential medication interactions include: Sedatives, Blood pressure medications.",
      "Use clinician guidance with: Pregnancy (lack of data)."
    ],
    "safetyFlags": [
      "pregnancy",
      "blood-pressure",
      "sedation"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements for Exercise and Athletic Performance",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "ginger": {
    "supplementId": "ginger",
    "supplementName": "Ginger (Zingiber officinale)",
    "aliases": [
      "ginger",
      "ginger root",
      "Ginger Zingiber officinale",
      "zingiber officinale"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Ginger has supportive evidence for pregnancy-related nausea and menstrual discomfort, with mixed findings for other outcomes.",
    "typicalUseCases": [
      "digestion",
      "digestive comfort",
      "immunity",
      "inflammation",
      "menstrual comfort",
      "nausea",
      "nausea support"
    ],
    "safetyNotes": [
      "Large doses may thin blood.",
      "May cause heartburn in some.",
      "Medication interaction review is advised, particularly with anticoagulants.",
      "Possible side effects include heartburn or gastrointestinal discomfort at higher intakes.",
      "Potential medication interactions include: Blood thinners, Diabetes medications."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "bleeding-risk",
      "blood-sugar"
    ],
    "citations": [
      {
        "title": "Ginger: Usefulness and Safety",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/ginger",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "ginger-tea": {
    "supplementId": "ginger-tea",
    "supplementName": "Ginger (Zingiber officinale)",
    "aliases": [
      "Ginger",
      "ginger tea",
      "Ginger Zingiber officinale",
      "Zingiber officinale"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Ginger has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "digestion",
      "immunity",
      "inflammation",
      "nausea"
    ],
    "safetyNotes": [
      "May cause mild heartburn at higher intakes.",
      "Potential medication interactions include: Blood thinners, Diabetes medications.",
      "Use clinician guidance with: Gallstones (consult clinician), Before surgery (high-dose use)."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk",
      "blood-sugar"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "ginkgo": {
    "supplementId": "ginkgo",
    "supplementName": "Ginkgo Biloba",
    "aliases": [
      "gingko",
      "ginkgo",
      "ginkgo biloba"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Ginkgo Biloba has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "brain health",
      "circulation",
      "circulatory support",
      "cognitive",
      "cognitive support",
      "eyes",
      "memory",
      "tinnitus"
    ],
    "safetyNotes": [
      "May increase bleeding risk.",
      "Potential medication interactions include: Blood thinners, NSAIDs, SSRIs.",
      "Use clinician guidance with: Bleeding disorders, Before surgery, Seizure disorders."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk"
    ],
    "citations": [
      {
        "title": "Ginkgo",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/ginkgo",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "ginseng-panax": {
    "supplementId": "ginseng-panax",
    "supplementName": "Panax Ginseng (Korean/Asian)",
    "aliases": [
      "Asian",
      "asian ginseng",
      "Asian)",
      "ginseng panax",
      "ginsing",
      "korean ginseng",
      "Korean/Asian",
      "panax ginseng",
      "Panax Ginseng (Korean",
      "Panax Ginseng Korean/Asian"
    ],
    "categories": [
      "adaptogen",
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Asian ginseng has mixed clinical evidence for fatigue, metabolic markers, and cognition, with heterogeneity across preparations.",
    "typicalUseCases": [
      "cognition",
      "endurance",
      "energy",
      "energy support",
      "fatigue",
      "focus support",
      "immunity",
      "mood"
    ],
    "safetyNotes": [
      "Can increase blood pressure.",
      "May cause insomnia, headache, or digestive upset.",
      "Possible side effects include insomnia or stimulation in sensitive users.",
      "Potential interactions include anticoagulants, glucose-lowering therapies, and stimulants.",
      "Potential medication interactions include: Blood thinners, Diabetes medications, Stimulants."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk",
      "blood-pressure",
      "blood-sugar",
      "stimulant"
    ],
    "citations": [
      {
        "title": "Asian Ginseng: Usefulness and Safety",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/asian-ginseng",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "glucosamine": {
    "supplementId": "glucosamine",
    "supplementName": "Glucosamine Sulfate",
    "aliases": [
      "glucosamine"
    ],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Glucosamine Sulfate has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "arthritis",
      "cartilage",
      "joint pain",
      "joints",
      "mobility"
    ],
    "safetyNotes": [
      "Derived from shellfish - use vegetarian form if allergic.",
      "Potential medication interactions include: Blood thinners (minor effect).",
      "Use clinician guidance with: Shellfish allergy (use vegetarian version), Pregnancy."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "bleeding-risk"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "glycine": {
    "supplementId": "glycine",
    "supplementName": "Glycine",
    "aliases": [],
    "categories": [
      "amino-acid"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Glycine has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "anti aging",
      "collagen",
      "glutathione",
      "recovery",
      "sleep"
    ],
    "safetyNotes": [
      "Potential medication interactions include: Clozapine (antipsychotic).",
      "Slightly sweet taste.",
      "Use clinician guidance with: Generally safe for all.",
      "Very safe."
    ],
    "safetyFlags": [
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements for Exercise and Athletic Performance",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "gotu-kola": {
    "supplementId": "gotu-kola",
    "supplementName": "Gotu Kola (Centella asiatica)",
    "aliases": [
      "Centella asiatica",
      "gotu kola",
      "Gotu Kola Centella asiatica"
    ],
    "categories": [
      "adaptogen",
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging",
      "traditional"
    ],
    "evidenceSummary": "Gotu Kola has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "anxiety",
      "circulation",
      "longevity",
      "memory",
      "skin",
      "wound healing"
    ],
    "safetyNotes": [
      "May cause drowsiness.",
      "Potential medication interactions include: Sedatives, Hepatotoxic drugs, Cholesterol medications.",
      "Sun sensitivity possible.",
      "Use clinician guidance with: Liver disease, Pregnancy."
    ],
    "safetyFlags": [
      "pregnancy",
      "sedation",
      "liver"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "greek-mountain-tea": {
    "supplementId": "greek-mountain-tea",
    "supplementName": "Greek Mountain Tea (Sideritis scardica/raeseri)",
    "aliases": [
      "greek mountain tea",
      "Greek Mountain Tea (Sideritis scardica",
      "Greek Mountain Tea Sideritis scardica/raeseri",
      "raeseri",
      "raeseri)",
      "Sideritis scardica/raeseri"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Greek Mountain Tea has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "brain health",
      "cognition",
      "digestion",
      "memory",
      "respiratory",
      "stress"
    ],
    "safetyNotes": [
      "Potential medication interactions include: No known significant interactions.",
      "Use clinician guidance with: No specific restrictions known.",
      "Very high safety profile; monitor if highly sensitive to herbs."
    ],
    "safetyFlags": [
      "general-caution"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "green-tea-matcha": {
    "supplementId": "green-tea-matcha",
    "supplementName": "Green Tea / Matcha (Camellia sinensis)",
    "aliases": [
      "camellia sinensis",
      "green tea",
      "Green Tea / Matcha Camellia sinensis",
      "green tea matcha",
      "matcha",
      "Matcha (Camellia sinensis)",
      "Matcha Camellia sinensis"
    ],
    "categories": [
      "antioxidant",
      "herb",
      "tea"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Green tea provides catechins and caffeine, with mixed evidence for metabolic and cardiometabolic endpoints in supplement form.",
    "typicalUseCases": [
      "antioxidant",
      "antioxidant support",
      "energy",
      "focus",
      "focus support",
      "heart health",
      "metabolic support",
      "metabolism"
    ],
    "safetyNotes": [
      "Caffeine sensitivity may cause jitters or insomnia.",
      "Caffeine-related effects include insomnia, jitteriness, and heart-rate sensitivity in some users.",
      "Concentrated green tea extracts have been linked to rare liver injury cases.",
      "May reduce iron absorption if consumed with meals.",
      "Potential medication interactions include: Blood thinners (vitamin K content), Stimulants."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "bleeding-risk",
      "stimulant",
      "liver"
    ],
    "citations": [
      {
        "title": "Green Tea: Usefulness and Safety",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/green-tea",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "green-tea-sencha": {
    "supplementId": "green-tea-sencha",
    "supplementName": "Green Tea - Sencha (Camellia sinensis)",
    "aliases": [
      "Camellia sinensis",
      "camellia sinensis green tea",
      "Green Tea - Sencha Camellia sinensis",
      "green tea sencha",
      "sencha"
    ],
    "categories": [
      "antioxidant",
      "herb",
      "tea"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Green Tea - Sencha has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "antioxidant",
      "energy",
      "focus",
      "heart health",
      "metabolism",
      "weight"
    ],
    "safetyNotes": [
      "Caffeine sensitivity may cause jitters or insomnia.",
      "Potential medication interactions include: Blood thinners (vitamin K content), Stimulants.",
      "Use clinician guidance with: Severe caffeine sensitivity."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk",
      "stimulant"
    ],
    "citations": [
      {
        "title": "Green Tea Benefits - Healthline",
        "publisher": "healthline.com",
        "url": "https://www.healthline.com/nutrition/top-10-evidence-based-health-benefits-of-green-tea",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Green Tea: Usefulness and Safety",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/green-tea",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Green Tea Knowledge - PMC",
        "publisher": "National Institutes of Health",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11899301",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "guduchi": {
    "supplementId": "guduchi",
    "supplementName": "Guduchi / Giloy (Tinospora cordifolia)",
    "aliases": [
      "Giloy (Tinospora cordifolia)",
      "Giloy Tinospora cordifolia",
      "guduchi",
      "Guduchi / Giloy",
      "Guduchi / Giloy Tinospora cordifolia",
      "Tinospora cordifolia"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging",
      "traditional"
    ],
    "evidenceSummary": "Guduchi / Giloy has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "allergy",
      "detox",
      "fever",
      "immunity",
      "inflammation",
      "liver"
    ],
    "safetyNotes": [
      "May lower blood sugar - monitor if diabetic.",
      "Potential medication interactions include: Immunosuppressants, Diabetes medications.",
      "Use clinician guidance with: Autoimmune conditions (may stimulate immune system), Pregnancy."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "blood-sugar",
      "stimulant"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "guggulu": {
    "supplementId": "guggulu",
    "supplementName": "Guggulu (Commiphora mukul)",
    "aliases": [
      "Commiphora mukul",
      "guggulu",
      "Guggulu Commiphora mukul"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging",
      "traditional"
    ],
    "evidenceSummary": "Guggulu has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "cholesterol",
      "inflammation",
      "joint health",
      "thyroid",
      "weight"
    ],
    "safetyNotes": [
      "May cause skin rash, diarrhea, or nausea.",
      "Potential medication interactions include: Thyroid medications, Blood thinners, Estrogen/progesterone.",
      "Use clinician guidance with: Pregnancy, Breastfeeding, Hyperthyroidism."
    ],
    "safetyFlags": [
      "pregnancy",
      "breastfeeding",
      "drug-interaction",
      "bleeding-risk",
      "thyroid",
      "liver"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "hawthorn": {
    "supplementId": "hawthorn",
    "supplementName": "Hawthorn Berry (Crataegus)",
    "aliases": [
      "crataegus",
      "crataegus monogyna",
      "hawthorn",
      "Hawthorn Berry",
      "Hawthorn Berry Crataegus",
      "hawthorne"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Hawthorn has mixed evidence for cardiovascular symptom measures and should not replace prescribed cardiac care.",
    "typicalUseCases": [
      "anxiety",
      "blood pressure",
      "circulation",
      "circulatory support",
      "heart health",
      "heart wellness support"
    ],
    "safetyNotes": [
      "Effects develop slowly - be patient.",
      "Potential interactions with cardiovascular and blood pressure medications require clinician review.",
      "Potential medication interactions include: Heart medications (digoxin), Blood pressure medications, ED medications.",
      "Use clinician guidance with: Consult doctor if on any heart medications."
    ],
    "safetyFlags": [
      "drug-interaction",
      "blood-pressure",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Hawthorn: Usefulness and Safety",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/hawthorn",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "hibiscus-tea": {
    "supplementId": "hibiscus-tea",
    "supplementName": "Hibiscus (Hibiscus sabdariffa)",
    "aliases": [
      "Hibiscus",
      "Hibiscus Hibiscus sabdariffa",
      "Hibiscus sabdariffa",
      "hibiscus tea"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Hibiscus has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "antioxidant",
      "blood pressure",
      "heart health"
    ],
    "safetyNotes": [
      "May lower blood pressure; monitor if already on antihypertensives.",
      "Potential medication interactions include: Blood pressure medications, Thiazide diuretics.",
      "Use clinician guidance with: Low blood pressure."
    ],
    "safetyFlags": [
      "blood-pressure"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "hyaluronic-acid": {
    "supplementId": "hyaluronic-acid",
    "supplementName": "Hyaluronic Acid",
    "aliases": [],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Hyaluronic Acid has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "eyes",
      "hydration",
      "joints",
      "skin",
      "wrinkles"
    ],
    "safetyNotes": [
      "Potential medication interactions include: None significant.",
      "Use clinician guidance with: Generally safe for all.",
      "Very safe."
    ],
    "safetyFlags": [
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "inositol": {
    "supplementId": "inositol",
    "supplementName": "Myo-Inositol",
    "aliases": [
      "inositol"
    ],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Myo-Inositol has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "anxiety",
      "blood sugar",
      "female reproductive",
      "fertility",
      "hormonal balance",
      "insulin sensitivity",
      "ocd",
      "ovulation"
    ],
    "safetyNotes": [
      "High doses can cause mild GI distress.",
      "PCOS protocols should use a 40:1 Myo: D-Chiro ratio; other ratios underperform.",
      "Potential medication interactions include: None significant.",
      "Use clinician guidance with: Generally safe for all."
    ],
    "safetyFlags": [
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "iodine": {
    "supplementId": "iodine",
    "supplementName": "Iodine (Potassium Iodide/Kelp)",
    "aliases": [
      "iodide",
      "iodin",
      "iodine",
      "Iodine (Potassium Iodide",
      "Iodine Potassium Iodide/Kelp",
      "Kelp",
      "Kelp)",
      "potassium iodide",
      "Potassium Iodide/Kelp"
    ],
    "categories": [
      "mineral"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Iodine is required for thyroid hormone production, and both low and excessive intakes can disrupt thyroid function.",
    "typicalUseCases": [
      "breast health",
      "detox",
      "energy",
      "metabolism",
      "prenatal micronutrient support",
      "thyroid",
      "thyroid support"
    ],
    "safetyNotes": [
      "Avoid excessive intake (>500mcg/day) unless supervised.",
      "Can trigger Hashimoto's flare-ups.",
      "People with thyroid disease and those who are pregnant should use supplemental iodine with individualized guidance.",
      "Potential medication interactions include: Thyroid medications, Lithium, Diuretics.",
      "Use clinician guidance with: Hashimoto's Thyroiditis (unless supervised), Hyperthyroidism."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "thyroid",
      "general-caution"
    ],
    "dosageRangeNote": "Adult RDA is generally 150 mcg/day, with higher needs in pregnancy and lactation.",
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Iodine - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Iodine-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "iron": {
    "supplementId": "iron",
    "supplementName": "Iron (Ferrous Bisglycinate)",
    "aliases": [
      "fe",
      "ferric",
      "ferrous",
      "Ferrous Bisglycinate",
      "iron",
      "Iron Ferrous Bisglycinate",
      "irron"
    ],
    "categories": [
      "mineral"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Iron supplementation is evidence-based when deficiency is confirmed; unnecessary use can create risk.",
    "typicalUseCases": [
      "anemia",
      "energy",
      "energy support when deficiency exists",
      "fatigue",
      "iron deficiency",
      "iron repletion when indicated",
      "restless leg"
    ],
    "safetyNotes": [
      "Excess iron is harmful and pro-oxidant.",
      "Keep iron products away from children due to overdose risk.",
      "Potential medication interactions include: Many medications - take separately, Thyroid medications, Bisphosphonates.",
      "Supplementation should ideally follow laboratory confirmation and clinician review.",
      "Test ferritin levels before supplementing."
    ],
    "safetyFlags": [
      "drug-interaction",
      "thyroid",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Iron - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "NIH ODS: Iron Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Iron-Consumer/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "jasmine-green-tea": {
    "supplementId": "jasmine-green-tea",
    "supplementName": "Jasmine Green Tea (Camellia sinensis)",
    "aliases": [
      "Camellia sinensis",
      "green jasmine tea",
      "jasmine green tea",
      "Jasmine Green Tea Camellia sinensis",
      "jasmine tea"
    ],
    "categories": [
      "antioxidant",
      "herb",
      "tea"
    ],
    "evidenceStrengthTags": [
      "emerging"
    ],
    "evidenceSummary": "Jasmine Green Tea is informed by traditional use and emerging research, while higher-quality clinical evidence remains limited.",
    "typicalUseCases": [
      "antioxidant",
      "focus",
      "stress"
    ],
    "safetyNotes": [
      "Contains caffeine.",
      "Potential medication interactions include: Stimulants (additive caffeine).",
      "Use clinician guidance with: Severe caffeine sensitivity."
    ],
    "safetyFlags": [
      "stimulant"
    ],
    "citations": [
      {
        "title": "Green Tea: Usefulness and Safety",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/green-tea",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Jasmine Tea Benefits - WebMD",
        "publisher": "webmd.com",
        "url": "https://www.webmd.com/diet/health-benefits-jasmine-tea",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "jatamansi": {
    "supplementId": "jatamansi",
    "supplementName": "Jatamansi (Nardostachys jatamansi)",
    "aliases": [
      "jatamansi",
      "Jatamansi Nardostachys jatamansi",
      "Nardostachys jatamansi"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging",
      "traditional"
    ],
    "evidenceSummary": "Jatamansi has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "anxiety",
      "calm",
      "grounding",
      "memory",
      "sleep"
    ],
    "safetyNotes": [
      "May cause drowsiness.",
      "Potential medication interactions include: Sedatives, CNS depressants.",
      "Use clinician guidance with: Pregnancy, Breastfeeding, Operating machinery."
    ],
    "safetyFlags": [
      "pregnancy",
      "breastfeeding",
      "sedation"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "kava": {
    "supplementId": "kava",
    "supplementName": "Kava (Piper methysticum)",
    "aliases": [
      "kava",
      "Kava Piper methysticum",
      "kavakava",
      "piper methysticum"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Kava has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "anxiety",
      "calm support",
      "muscle tension",
      "relaxation",
      "sleep",
      "social anxiety",
      "stress support"
    ],
    "safetyNotes": [
      "Can affect liver (rare with quality products).",
      "Kava products may carry liver safety concerns; product quality and medical history are important.",
      "May cause skin changes with heavy use.",
      "Potential medication interactions include: Alcohol, Sedatives, Parkinson's medications.",
      "Use clinician guidance with: Liver disease, Depression (may worsen), Pregnancy."
    ],
    "safetyFlags": [
      "pregnancy",
      "breastfeeding",
      "drug-interaction",
      "sedation",
      "liver"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Kava",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/kava",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "krill-oil": {
    "supplementId": "krill-oil",
    "supplementName": "Krill Oil",
    "aliases": [
      "euphausia superba oil",
      "krill oil"
    ],
    "categories": [
      "fatty-acid"
    ],
    "evidenceStrengthTags": [
      "well-supported",
      "mixed"
    ],
    "evidenceSummary": "Krill oil supplies EPA and DHA, and expected effects generally track total omega-3 intake rather than marketing claims about delivery form.",
    "typicalUseCases": [
      "brain health",
      "brain health support",
      "heart health",
      "heart support",
      "inflammation",
      "triglyceride support"
    ],
    "safetyNotes": [
      "Potential bleeding-risk considerations are similar to other omega-3 supplements, especially with anticoagulant therapy.",
      "Potential medication interactions include: Blood thinners.",
      "Shellfish allergy contraindication.",
      "Use clinician guidance with: Shellfish allergy, Before surgery."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk"
    ],
    "dosageRangeNote": "Compare products by EPA plus DHA content, not only by total oil milligrams.",
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Omega-3 Fatty Acids - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "l-arginine": {
    "supplementId": "l-arginine",
    "supplementName": "L-Arginine",
    "aliases": [],
    "categories": [
      "amino-acid"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "L-Arginine has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "blood flow",
      "erectile function",
      "libido",
      "performance",
      "sexual health"
    ],
    "safetyNotes": [
      "Can lower blood pressure.",
      "May cause GI upset at higher doses.",
      "Potential medication interactions include: Blood pressure medications, ED medications, Nitrates.",
      "Use clinician guidance with: Low blood pressure, On nitrate medications."
    ],
    "safetyFlags": [
      "blood-pressure"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements for Exercise and Athletic Performance",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "l-carnitine": {
    "supplementId": "l-carnitine",
    "supplementName": "L-Carnitine",
    "aliases": [],
    "categories": [
      "amino-acid"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "L-Carnitine has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "energy",
      "fertility",
      "male reproductive",
      "sperm motility",
      "sperm quality"
    ],
    "safetyNotes": [
      "Fishy body odor (rare)."
    ],
    "safetyFlags": [
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements for Exercise and Athletic Performance",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "l-citrulline": {
    "supplementId": "l-citrulline",
    "supplementName": "L-Citrulline",
    "aliases": [],
    "categories": [
      "amino-acid"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "L-Citrulline has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "blood flow",
      "blood pressure",
      "endurance",
      "erectile function",
      "exercise",
      "performance",
      "pump",
      "sexual health"
    ],
    "safetyNotes": [
      "May cause mild GI upset at high doses.",
      "Potential medication interactions include: Blood pressure medications, ED medications, Nitrates.",
      "Use clinician guidance with: Low blood pressure, On nitrate medications.",
      "Very safe."
    ],
    "safetyFlags": [
      "blood-pressure"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements for Exercise and Athletic Performance",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "l-glutamine": {
    "supplementId": "l-glutamine",
    "supplementName": "L-Glutamine",
    "aliases": [],
    "categories": [
      "amino-acid"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "L-Glutamine has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "gut health",
      "immunity",
      "leaky gut",
      "recovery",
      "sugar cravings"
    ],
    "safetyNotes": [
      "May avoid if sensitive to MSG.",
      "Potential medication interactions include: Chemotherapy drugs, Anti-seizure medications.",
      "Use clinician guidance with: Severe liver disease, MSG sensitivity.",
      "Very safe."
    ],
    "safetyFlags": [
      "liver"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements for Exercise and Athletic Performance",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "l-theanine": {
    "supplementId": "l-theanine",
    "supplementName": "L-Theanine",
    "aliases": [],
    "categories": [
      "amino-acid"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "L-Theanine has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "anxiety",
      "caffeine jitters",
      "calm",
      "focus",
      "sleep",
      "stress"
    ],
    "safetyNotes": [
      "Potential medication interactions include: Blood pressure medications (may enhance).",
      "Use clinician guidance with: Low blood pressure (use cautiously).",
      "Very safe. May lower blood pressure slightly."
    ],
    "safetyFlags": [
      "blood-pressure"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements for Exercise and Athletic Performance",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "l-tyrosine": {
    "supplementId": "l-tyrosine",
    "supplementName": "L-Tyrosine",
    "aliases": [],
    "categories": [
      "amino-acid"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "L-Tyrosine has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "cognitive",
      "dopamine",
      "focus",
      "motivation",
      "stress",
      "thyroid"
    ],
    "safetyNotes": [
      "May cause jitteriness or anxiety in high doses.",
      "Potential medication interactions include: MAOIs (dangerous), Thyroid medications, Levodopa.",
      "Use clinician guidance with: Hyperthyroidism, Melanoma, MAOIs."
    ],
    "safetyFlags": [
      "drug-interaction",
      "thyroid"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements for Exercise and Athletic Performance",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "lemon-balm": {
    "supplementId": "lemon-balm",
    "supplementName": "Lemon Balm (Melissa officinalis)",
    "aliases": [
      "lemon balm",
      "Lemon Balm Melissa officinalis",
      "Melissa officinalis"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging",
      "traditional"
    ],
    "evidenceSummary": "Lemon Balm has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "anxiety",
      "calm",
      "cognition",
      "digestion",
      "mood",
      "sleep"
    ],
    "safetyNotes": [
      "May cause increased appetite.",
      "Potential medication interactions include: Sedatives, Thyroid medications.",
      "Use clinician guidance with: Hypothyroidism (may reduce thyroid function)."
    ],
    "safetyFlags": [
      "sedation",
      "thyroid"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "lemon-verbena": {
    "supplementId": "lemon-verbena",
    "supplementName": "Lemon Verbena (Aloysia citrodora)",
    "aliases": [
      "Aloysia citrodora",
      "lemon verbena",
      "Lemon Verbena Aloysia citrodora"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Lemon Verbena has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "anxiety",
      "digestion",
      "recovery",
      "sleep",
      "stress"
    ],
    "safetyNotes": [
      "Avoid excessive use in pregnancy.",
      "Potential medication interactions include: Sedatives (additive calming effects).",
      "Rare kidney irritation with prolonged high intake.",
      "Use clinician guidance with: Pregnancy (avoid excessive intake)."
    ],
    "safetyFlags": [
      "pregnancy",
      "sedation",
      "kidney"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "lions-mane": {
    "supplementId": "lions-mane",
    "supplementName": "Lion's Mane (Hericium erinaceus)",
    "aliases": [
      "Hericium erinaceus",
      "Lion's Mane",
      "Lion's Mane Hericium erinaceus",
      "lions mane",
      "Lions Mane (Hericium erinaceus)"
    ],
    "categories": [
      "mushroom"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Lion's Mane has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "brain fog",
      "brain health",
      "cognition",
      "focus",
      "memory",
      "mood",
      "neuroprotection"
    ],
    "safetyNotes": [
      "May cause itchy skin in rare cases (possible sign of NGF activity).",
      "Potential medication interactions include: Blood thinners (mild effect), Diabetes medications.",
      "Use clinician guidance with: Mushroom allergies."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk",
      "blood-sugar"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "maca": {
    "supplementId": "maca",
    "supplementName": "Maca Root (Lepidium meyenii)",
    "aliases": [
      "lepidium meyenii",
      "maca",
      "maca root",
      "Maca Root Lepidium meyenii",
      "macca"
    ],
    "categories": [
      "adaptogen",
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Maca Root is informed by traditional use and emerging research, while higher-quality clinical evidence remains limited.",
    "typicalUseCases": [
      "athletic performance",
      "energy",
      "hormonal balance",
      "libido",
      "libido support",
      "menopause",
      "mood",
      "sexual health"
    ],
    "safetyNotes": [
      "Goitrogenic (affects thyroid in sensitive individuals).",
      "May cause GI upset.",
      "Potential medication interactions include: Theoretically may affect thyroid medications.",
      "Use clinician guidance with: Pregnancy (insufficient safety data), Thyroid conditions (use with caution), Hormone-sensitive conditions."
    ],
    "safetyFlags": [
      "pregnancy",
      "thyroid",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "magnesium": {
    "supplementId": "magnesium",
    "supplementName": "Magnesium",
    "aliases": [
      "mag",
      "magnesium citrate",
      "magnesium glycinate",
      "magnessium"
    ],
    "categories": [
      "mineral"
    ],
    "evidenceStrengthTags": [
      "well-supported",
      "mixed"
    ],
    "evidenceSummary": "Magnesium is an essential mineral with strong physiological rationale; trial outcomes vary by baseline status and salt form.",
    "typicalUseCases": [
      "anxiety",
      "blood pressure",
      "energy",
      "migraine",
      "muscle cramps",
      "muscle function support",
      "relaxation",
      "sleep"
    ],
    "safetyNotes": [
      "Gastrointestinal effects can occur at higher supplemental doses depending on formulation.",
      "Kidney impairment requires individualized dosing guidance.",
      "Potential medication interactions include: Antibiotics (take separately), Bisphosphonates, Diuretics.",
      "Too much can cause loose stools (esp. citrate, oxide).",
      "Use clinician guidance with: Severe kidney disease (consult doctor)."
    ],
    "safetyFlags": [
      "kidney",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Magnesium - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "NIH ODS: Magnesium Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Magnesium-Consumer/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "melatonin": {
    "supplementId": "melatonin",
    "supplementName": "Melatonin",
    "aliases": [
      "melatonine",
      "n-acetyl-5-methoxytryptamine"
    ],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "mixed"
    ],
    "evidenceSummary": "Evidence is strongest for circadian timing support, while broader sleep outcomes show variable responses.",
    "typicalUseCases": [
      "antioxidant",
      "circadian rhythm",
      "insomnia",
      "jet lag",
      "jet lag adjustment",
      "sleep",
      "sleep onset support"
    ],
    "safetyNotes": [
      "Daytime drowsiness can occur in some users.",
      "Higher doses (3mg+) do not improve sleep outcomes but increase next-day grogginess and temperature changes.",
      "May cause vivid dreams.",
      "Potential interactions include sedatives and some anticoagulants.",
      "Potential medication interactions include: Blood thinners, Immunosuppressants, Diabetes medications."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "bleeding-risk",
      "blood-sugar",
      "sedation",
      "stimulant"
    ],
    "citations": [
      {
        "title": "Melatonin: What You Need To Know",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/melatonin-what-you-need-to-know",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "NCCIH: Melatonin",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/melatonin",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "milk-thistle": {
    "supplementId": "milk-thistle",
    "supplementName": "Milk Thistle (Silybum marianum)",
    "aliases": [
      "mary thistle",
      "milk thistle",
      "Milk Thistle Silybum marianum",
      "silybum marianum",
      "silymarin"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Milk thistle evidence for liver and metabolic outcomes remains mixed, with inconsistent effects across trials.",
    "typicalUseCases": [
      "antioxidant support",
      "detox",
      "hangover",
      "liver",
      "liver protection",
      "liver support",
      "toxin exposure"
    ],
    "safetyNotes": [
      "Allergic reactions are more likely in people sensitive to related plants.",
      "May cause allergic reaction in people allergic to ragweed.",
      "Potential medication interactions include: May affect liver enzyme metabolism of many drugs.",
      "Product quality can vary, and contamination or inconsistent active content has been reported in some markets.",
      "Use clinician guidance with: Hormone-sensitive conditions (weak estrogenic effect)."
    ],
    "safetyFlags": [
      "drug-interaction",
      "liver",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Milk Thistle: Usefulness and Safety",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/milk-thistle",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "mucuna": {
    "supplementId": "mucuna",
    "supplementName": "Mucuna pruriens (Kapikacchu)",
    "aliases": [
      "Kapikacchu",
      "mucuna",
      "Mucuna pruriens",
      "Mucuna pruriens Kapikacchu"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging",
      "traditional"
    ],
    "evidenceSummary": "Mucuna pruriens has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "dopamine",
      "fertility",
      "libido",
      "male reproductive",
      "mood",
      "motivation",
      "sexual health",
      "sexual performance"
    ],
    "safetyNotes": [
      "Can be stimulating; avoid late-day dosing.",
      "May cause nausea, headache, or jitteriness in some.",
      "Potential medication interactions include: MAOIs, Parkinson's medications (carbidopa/levodopa), Psychiatric medications.",
      "Use clinician guidance with: Parkinson's (unless supervised), Psychotic disorders, Heart arrhythmias."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "stimulant"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "nac": {
    "supplementId": "nac",
    "supplementName": "N-Acetyl Cysteine (NAC)",
    "aliases": [
      "N-Acetyl Cysteine",
      "N-Acetyl Cysteine NAC",
      "nac"
    ],
    "categories": [
      "amino-acid"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "N-Acetyl Cysteine has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "addiction",
      "detox",
      "glutathione",
      "liver",
      "mental health",
      "ocd",
      "respiratory"
    ],
    "safetyNotes": [
      "May cause GI upset.",
      "Potential medication interactions include: Nitroglycerin, Blood thinners, Chemotherapy drugs.",
      "Sulfur smell.",
      "Use clinician guidance with: Active bleeding ulcers."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements for Exercise and Athletic Performance",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "nattokinase": {
    "supplementId": "nattokinase",
    "supplementName": "Nattokinase",
    "aliases": [],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Nattokinase has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "blood pressure",
      "circulation",
      "clot prevention",
      "heart health"
    ],
    "safetyNotes": [
      "Potential medication interactions include: Warfarin, Aspirin, Other blood thinners.",
      "Powerful blood thinner.",
      "Use clinician guidance with: Bleeding disorders, Before surgery, Taking blood thinners."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "nmn": {
    "supplementId": "nmn",
    "supplementName": "NMN (Nicotinamide Mononucleotide)",
    "aliases": [
      "Nicotinamide Mononucleotide",
      "nmn",
      "NMN Nicotinamide Mononucleotide"
    ],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "NMN has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "anti aging",
      "energy",
      "longevity",
      "nad"
    ],
    "safetyNotes": [
      "Degrades in heat (keep refrigerated).",
      "Expensive.",
      "Potential medication interactions include: None significant.",
      "Use clinician guidance with: Active cancer (theoretical risk of fueling growth)."
    ],
    "safetyFlags": [
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "olive-leaf": {
    "supplementId": "olive-leaf",
    "supplementName": "Olive Leaf (Olea europaea)",
    "aliases": [
      "Olea europaea",
      "olive leaf",
      "Olive Leaf Olea europaea"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Olive Leaf has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "antioxidant",
      "blood pressure",
      "blood sugar",
      "cholesterol",
      "heart health",
      "immunity"
    ],
    "safetyNotes": [
      "May lower blood pressure; monitor with antihypertensives.",
      "Possible die-off reaction at high doses.",
      "Potential medication interactions include: Blood pressure medications, Diabetes medications.",
      "Use clinician guidance with: Low blood pressure."
    ],
    "safetyFlags": [
      "blood-pressure",
      "blood-sugar"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "omega-3": {
    "supplementId": "omega-3",
    "supplementName": "Omega-3 Fish Oil (EPA/DHA)",
    "aliases": [
      "dha",
      "DHA)",
      "epa",
      "EPA/DHA",
      "fish oil",
      "omega 3",
      "Omega-3 Fish Oil",
      "Omega-3 Fish Oil (EPA",
      "Omega-3 Fish Oil EPA/DHA",
      "omega3"
    ],
    "categories": [
      "fatty-acid"
    ],
    "evidenceStrengthTags": [
      "well-supported",
      "mixed"
    ],
    "evidenceSummary": "Omega-3 fatty acids are well studied for select cardiovascular biomarkers, with effects varying by dose and EPA/DHA composition.",
    "typicalUseCases": [
      "brain health",
      "brain health support",
      "depression",
      "eyes",
      "fertility",
      "general inflammation support",
      "heart health",
      "heart support"
    ],
    "safetyNotes": [
      "Choose quality brands tested for heavy metals.",
      "High doses (>3g/day) may thin blood.",
      "High intakes may increase bleeding risk in some contexts, especially with anticoagulant therapy.",
      "Potential medication interactions include: Blood thinners (enhanced effect), Blood pressure medications.",
      "Use clinician guidance with: Fish allergies, Before surgery (stop 1-2 weeks prior)."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk",
      "blood-pressure"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "NIH ODS: Omega-3 Fatty Acids Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-Consumer/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Omega-3 Fatty Acids - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "oolong-tea-tieguanyin": {
    "supplementId": "oolong-tea-tieguanyin",
    "supplementName": "Oolong Tea - Tieguanyin (Camellia sinensis)",
    "aliases": [
      "Camellia sinensis",
      "Oolong Tea - Tieguanyin Camellia sinensis",
      "oolong tea tieguanyin"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Oolong Tea - Tieguanyin has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "blood sugar",
      "heart health",
      "metabolism",
      "weight"
    ],
    "safetyNotes": [
      "Contains caffeine.",
      "Potential medication interactions include: Stimulants (additive caffeine).",
      "Use clinician guidance with: Severe caffeine sensitivity."
    ],
    "safetyFlags": [
      "stimulant"
    ],
    "citations": [
      {
        "title": "Oolong Benefits - Healthline",
        "publisher": "healthline.com",
        "url": "https://www.healthline.com/nutrition/oolong-tea-benefits",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Oolong Metabolic Rate - ScienceDirect",
        "publisher": "sciencedirect.com",
        "url": "https://www.sciencedirect.com/science/article/pii/S0022316622144937",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "passionflower": {
    "supplementId": "passionflower",
    "supplementName": "Passionflower (Passiflora incarnata)",
    "aliases": [
      "maypop",
      "passiflora incarnata",
      "passionflower",
      "Passionflower Passiflora incarnata"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Passionflower has limited but emerging evidence for anxiety and sleep-related outcomes.",
    "typicalUseCases": [
      "anxiety",
      "calm",
      "calm support",
      "racing thoughts",
      "relaxation",
      "sleep",
      "sleep quality support"
    ],
    "safetyNotes": [
      "May cause drowsiness.",
      "Potential medication interactions include: Sedatives, Blood thinners, MAOIs.",
      "Sedation can occur and may be amplified when combined with other sedative agents.",
      "Use clinician guidance with: Pregnancy, Breastfeeding, Before surgery."
    ],
    "safetyFlags": [
      "pregnancy",
      "breastfeeding",
      "drug-interaction",
      "bleeding-risk",
      "sedation"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Passionflower: Usefulness and Safety",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/passionflower",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "peppermint-tea": {
    "supplementId": "peppermint-tea",
    "supplementName": "Peppermint (Mentha \xC3\u2014 piperita)",
    "aliases": [
      "Mentha \xC3\u2014 piperita",
      "Peppermint",
      "Peppermint Mentha \xC3\u2014 piperita",
      "peppermint tea"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Peppermint has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "bloating",
      "digestion",
      "gut health",
      "ibs",
      "nausea"
    ],
    "safetyNotes": [
      "Enteric-coated oil is preferred for IBS to avoid reflux.",
      "May worsen acid reflux by relaxing the lower esophageal sphincter.",
      "Potential medication interactions include: Antacids (separate timing if using enteric-coated products).",
      "Use clinician guidance with: GERD or hiatal hernia."
    ],
    "safetyFlags": [
      "general-caution"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "phosphatidylserine": {
    "supplementId": "phosphatidylserine",
    "supplementName": "Phosphatidylserine (PS)",
    "aliases": [
      "phosphatidylserine",
      "Phosphatidylserine PS",
      "PS"
    ],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Phosphatidylserine has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "adhd",
      "brain health",
      "cognitive",
      "cortisol",
      "memory",
      "stress"
    ],
    "safetyNotes": [
      "Potential medication interactions include: Blood thinners, Anticholinergic medications.",
      "Sunflower-derived preferred over soy.",
      "Use clinician guidance with: Generally safe for all.",
      "Very safe."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "potassium": {
    "supplementId": "potassium",
    "supplementName": "Potassium",
    "aliases": [
      "k",
      "potassium chloride",
      "potassium citrate"
    ],
    "categories": [
      "mineral"
    ],
    "evidenceStrengthTags": [
      "well-supported",
      "mixed"
    ],
    "evidenceSummary": "Potassium supports blood pressure regulation, nerve signaling, and muscle contraction, with food-first intake generally preferred.",
    "typicalUseCases": [
      "blood pressure",
      "blood pressure support",
      "cramps",
      "electrolyte support",
      "electrolytes",
      "heart health",
      "muscle function support"
    ],
    "safetyNotes": [
      "Potential medication interactions include: ACE inhibitors, ARBs, Potassium-sparing diuretics.",
      "Supplement doses above 99mg require prescription for safety.",
      "Supplemental potassium may be unsafe in kidney impairment or when combined with medications that reduce potassium excretion.",
      "Use clinician guidance with: Kidney disease, Taking potassium-sparing medications, Adrenal insufficiency."
    ],
    "safetyFlags": [
      "drug-interaction",
      "blood-pressure",
      "kidney",
      "general-caution"
    ],
    "dosageRangeNote": "Adequate intake targets are generally in the gram range and are usually achieved through foods rather than high-dose supplements.",
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Potassium - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Potassium-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "pqq": {
    "supplementId": "pqq",
    "supplementName": "PQQ (Pyrroloquinoline Quinone)",
    "aliases": [
      "pqq",
      "PQQ Pyrroloquinoline Quinone",
      "Pyrroloquinoline Quinone"
    ],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "PQQ has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "anti aging",
      "brain health",
      "cognition",
      "energy",
      "mitochondria"
    ],
    "safetyNotes": [
      "Potential medication interactions include: None significant.",
      "Use clinician guidance with: Generally safe.",
      "Very safe."
    ],
    "safetyFlags": [
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "probiotics": {
    "supplementId": "probiotics",
    "supplementName": "Probiotics (Multi-strain)",
    "aliases": [
      "bifidobacterium",
      "lactobacillus",
      "Multi-strain",
      "probiotic",
      "probiotics",
      "Probiotics Multi-strain"
    ],
    "categories": [
      "probiotic"
    ],
    "evidenceStrengthTags": [
      "mixed"
    ],
    "evidenceSummary": "Probiotic effects are strain-specific; outcomes vary by organism, dose, and individual context.",
    "typicalUseCases": [
      "bloating",
      "digestion",
      "digestive comfort",
      "gut health",
      "gut microbiome support",
      "ibs",
      "immunity",
      "mood"
    ],
    "safetyNotes": [
      "May cause temporary gas/bloating as gut adjusts.",
      "Most healthy adults tolerate probiotics, but immunocompromised individuals should seek clinical guidance first.",
      "Potential medication interactions include: Antibiotics (take separately), Immunosuppressants.",
      "Quality varies greatly.",
      "Use caution in preterm infants and severely immunocompromised patients unless supervised by appropriate clinicians."
    ],
    "safetyFlags": [
      "drug-interaction",
      "autoimmune",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Probiotics: What You Need To Know",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/probiotics-what-you-need-to-know",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "FDA warns hospitals not to give preterm infants probiotic products due to risk of invasive, potentially fatal disease",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/hfp-constituent-updates/fda-warns-hospitals-not-give-preterm-infants-probiotic-products-risk-invasive-potentially-fatal",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "quercetin": {
    "supplementId": "quercetin",
    "supplementName": "Quercetin",
    "aliases": [],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Quercetin has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "allergies",
      "antihistamine",
      "antiviral",
      "immunity",
      "inflammation",
      "longevity",
      "senolytic"
    ],
    "safetyNotes": [
      "Poor absorption alone - use with bromelain or phospholipid form.",
      "Potential medication interactions include: Blood thinners, Antibiotics, Cyclosporine.",
      "Use clinician guidance with: Kidney disease (high doses)."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk",
      "kidney"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "red-clover": {
    "supplementId": "red-clover",
    "supplementName": "Red Clover",
    "aliases": [
      "red clover isoflavones",
      "trifolium pratense"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Red clover isoflavones show mixed evidence for menopausal symptom support and other outcomes.",
    "typicalUseCases": [
      "cervical mucus",
      "female reproductive",
      "fertility",
      "hormonal balance",
      "menopause support",
      "sexual health",
      "women wellness support"
    ],
    "safetyNotes": [
      "Estrogenic effects.",
      "Potential medication interactions include: Blood thinners, Estrogen therapies.",
      "Use caution with hormone-sensitive conditions and with anticoagulant or antiplatelet medications.",
      "Use clinician guidance with: Estrogen-sensitive cancers."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "bleeding-risk"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Red Clover: Usefulness and Safety",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/red-clover",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "reishi": {
    "supplementId": "reishi",
    "supplementName": "Reishi (Ganoderma lucidum)",
    "aliases": [
      "Ganoderma lucidum",
      "reishi",
      "Reishi Ganoderma lucidum"
    ],
    "categories": [
      "adaptogen",
      "mushroom"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Reishi has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "calm",
      "immunity",
      "liver",
      "longevity",
      "sleep",
      "stress"
    ],
    "safetyNotes": [
      "Can be drying (increase water intake).",
      "May cause digestive upset.",
      "Potential medication interactions include: Blood thinners, Immunosuppressants, Blood pressure medications.",
      "Use clinician guidance with: Bleeding disorders, Before surgery, Pregnancy."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "bleeding-risk",
      "blood-pressure"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "resveratrol": {
    "supplementId": "resveratrol",
    "supplementName": "Resveratrol",
    "aliases": [],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Resveratrol has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "anti aging",
      "brain health",
      "heart health",
      "longevity",
      "sirtuins"
    ],
    "safetyNotes": [
      "May have estrogenic effects.",
      "Potential medication interactions include: Blood thinners, Statins, Some cancer medications.",
      "Quality varies.",
      "Use clinician guidance with: Hormone-sensitive conditions, Bleeding disorders."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "rhodiola": {
    "supplementId": "rhodiola",
    "supplementName": "Rhodiola Rosea",
    "aliases": [
      "golden root",
      "rhodiola",
      "rhodiola rosea",
      "rodiola"
    ],
    "categories": [
      "adaptogen",
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Rhodiola has mixed evidence for stress and fatigue outcomes, with response varying by extract profile and study design.",
    "typicalUseCases": [
      "endurance",
      "energy",
      "fatigue",
      "fatigue resilience",
      "focus",
      "focus support",
      "mental performance",
      "mood"
    ],
    "safetyNotes": [
      "Can cause insomnia if taken late.",
      "May be too stimulating for some.",
      "Potential medication interactions include: SSRIs, MAOIs, Stimulants.",
      "Use clinician guidance with: Bipolar disorder (may trigger mania), Severe anxiety (may worsen initially)."
    ],
    "safetyFlags": [
      "drug-interaction",
      "stimulant",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Rhodiola: Usefulness and Safety",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/rhodiola",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "saffron": {
    "supplementId": "saffron",
    "supplementName": "Saffron (Crocus sativus)",
    "aliases": [
      "Crocus sativus",
      "saffron",
      "Saffron Crocus sativus"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Saffron has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "anxiety",
      "appetite",
      "depression",
      "eyes",
      "mood",
      "pms"
    ],
    "safetyNotes": [
      "Expensive - watch for adulterated products.",
      "High doses can be toxic (avoid over 5g/day).",
      "Potential medication interactions include: Blood thinners, Blood pressure medications, SSRIs (may enhance).",
      "Use clinician guidance with: Pregnancy (high doses can cause contractions), Bipolar disorder."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "bleeding-risk",
      "blood-pressure"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "same": {
    "supplementId": "same",
    "supplementName": "SAMe (S-Adenosyl Methionine)",
    "aliases": [
      "S-Adenosyl Methionine",
      "same",
      "SAMe S-Adenosyl Methionine"
    ],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "SAMe has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "arthritis",
      "depression",
      "joints",
      "liver",
      "mood"
    ],
    "safetyNotes": [
      "Can cause anxiety, insomnia, or GI upset.",
      "May trigger mania in bipolar.",
      "Potential medication interactions include: SSRIs, MAOIs, Parkinson's medications.",
      "Use clinician guidance with: Bipolar disorder (may trigger mania), Anxiety disorders (may worsen)."
    ],
    "safetyFlags": [
      "drug-interaction"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "saw-palmetto": {
    "supplementId": "saw-palmetto",
    "supplementName": "Saw Palmetto",
    "aliases": [
      "sabal serrulata",
      "serenoa repens"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Saw palmetto has not shown consistent benefit in high-quality trials for lower urinary tract symptom outcomes.",
    "typicalUseCases": [
      "beauty",
      "hormones",
      "prostate wellness support"
    ],
    "safetyNotes": [
      "Mild digestive upset.",
      "Potential interactions with anticoagulants and hormone-related treatments should be reviewed before use.",
      "Potential medication interactions include: Blood thinners, Hormone therapies.",
      "Use clinician guidance with: Pregnancy, Breastfeeding."
    ],
    "safetyFlags": [
      "pregnancy",
      "breastfeeding",
      "drug-interaction",
      "bleeding-risk",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Saw Palmetto: Usefulness and Safety",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/saw-palmetto",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "schisandra": {
    "supplementId": "schisandra",
    "supplementName": "Schisandra Berry (Wu Wei Zi)",
    "aliases": [
      "schisandra",
      "Schisandra Berry",
      "Schisandra Berry Wu Wei Zi",
      "Wu Wei Zi"
    ],
    "categories": [
      "adaptogen",
      "herb"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Schisandra Berry has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "beauty",
      "detox",
      "endurance",
      "focus",
      "liver",
      "stress"
    ],
    "safetyNotes": [
      "Do not use during acute infection (binds heat).",
      "Increases stomach acid.",
      "Potential medication interactions include: Changes liver metabolism of many drugs (CYP enzymes).",
      "Use clinician guidance with: GERD/Acid reflux, Peptic ulcers, Pregnancy."
    ],
    "safetyFlags": [
      "pregnancy",
      "liver"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "selenium": {
    "supplementId": "selenium",
    "supplementName": "Selenium",
    "aliases": [
      "se",
      "selenite",
      "selenomethionine"
    ],
    "categories": [
      "mineral"
    ],
    "evidenceStrengthTags": [
      "well-supported",
      "mixed"
    ],
    "evidenceSummary": "Selenium contributes to antioxidant systems and thyroid-related enzymes, with a relatively narrow margin between adequacy and excess.",
    "typicalUseCases": [
      "antioxidant",
      "antioxidant support",
      "cancer prevention",
      "fertility",
      "immunity",
      "sexual health",
      "sperm motility",
      "sperm quality"
    ],
    "safetyNotes": [
      "Garlic breath at high doses.",
      "Long-term excessive selenium intake can lead to adverse effects such as selenosis.",
      "Potential medication interactions include: Blood thinners, Cholesterol medications, Chemotherapy drugs.",
      "Toxicity possible over 400mcg/day.",
      "Use clinician guidance with: Skin cancer history (high doses may be problematic)."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk",
      "thyroid",
      "general-caution"
    ],
    "dosageRangeNote": "Adult RDA is commonly 55 mcg/day, and long-term intakes above upper limits should be avoided.",
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Selenium - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Selenium-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "shankhpushpi": {
    "supplementId": "shankhpushpi",
    "supplementName": "Shankhpushpi (Convolvulus pluricaulis)",
    "aliases": [
      "Convolvulus pluricaulis",
      "shankhpushpi",
      "Shankhpushpi Convolvulus pluricaulis"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging",
      "traditional"
    ],
    "evidenceSummary": "Shankhpushpi has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "anxiety",
      "calm",
      "concentration",
      "focus",
      "intelligence",
      "memory"
    ],
    "safetyNotes": [
      "May cause drowsiness in some.",
      "Potential medication interactions include: CNS depressants, Anticholinergic drugs.",
      "Use clinician guidance with: Pregnancy, Breastfeeding."
    ],
    "safetyFlags": [
      "pregnancy",
      "breastfeeding",
      "sedation"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "shatavari": {
    "supplementId": "shatavari",
    "supplementName": "Shatavari (Asparagus racemosus)",
    "aliases": [
      "Asparagus racemosus",
      "shatavari",
      "Shatavari Asparagus racemosus"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging",
      "traditional"
    ],
    "evidenceSummary": "Shatavari has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "cervical mucus",
      "female reproductive",
      "fertility",
      "hormonal balance",
      "lactation",
      "menopause",
      "ovulation",
      "vitality"
    ],
    "safetyNotes": [
      "May cause weight gain in some due to nourishing quality.",
      "Potential medication interactions include: Diuretics, Lithium.",
      "Pregnancy safety data are limited; avoid high doses without supervision.",
      "Use clinician guidance with: Pregnancy (precaution due to limited data), Estrogen-sensitive conditions (use with caution), Kidney disorders."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "kidney"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "shilajit": {
    "supplementId": "shilajit",
    "supplementName": "Shilajit",
    "aliases": [
      "mineral pitch",
      "shilajeet"
    ],
    "categories": [
      "adaptogen",
      "herb"
    ],
    "evidenceStrengthTags": [
      "emerging",
      "traditional"
    ],
    "evidenceSummary": "Shilajit has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "anti aging",
      "energy",
      "energy support",
      "mineral absorption",
      "mitochondria",
      "testosterone",
      "vitality",
      "vitality support"
    ],
    "safetyNotes": [
      "Choose purified, quality-tested products because contamination risk can vary across products.",
      "Potential medication interactions include: May enhance effects of other supplements.",
      "Use clinician guidance with: Hemochromatosis (iron overload), Gout, Pregnancy.",
      "Use only purified, tested products - raw form may contain heavy metals."
    ],
    "safetyFlags": [
      "pregnancy",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "smoked-tea-lapsang-souchong": {
    "supplementId": "smoked-tea-lapsang-souchong",
    "supplementName": "Smoked Tea - Lapsang Souchong (Camellia sinensis)",
    "aliases": [
      "Camellia sinensis",
      "Smoked Tea - Lapsang Souchong Camellia sinensis",
      "smoked tea lapsang souchong"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "emerging"
    ],
    "evidenceSummary": "Smoked Tea - Lapsang Souchong is informed by traditional use and emerging research, while higher-quality clinical evidence remains limited.",
    "typicalUseCases": [
      "antioxidant",
      "digestion"
    ],
    "safetyNotes": [
      "Contains caffeine.",
      "Potential medication interactions include: Stimulants (additive caffeine).",
      "Smoky flavor can be intense for sensitive users.",
      "Use clinician guidance with: Severe caffeine sensitivity."
    ],
    "safetyFlags": [
      "stimulant"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Lapsang Souchong Guide",
        "publisher": "theuklooseleafteacompany.co.uk",
        "url": "https://theuklooseleafteacompany.co.uk/blogs/news/what-is-lapsang-souchong-tea",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "spirulina": {
    "supplementId": "spirulina",
    "supplementName": "Spirulina",
    "aliases": [],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Spirulina has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "antioxidant",
      "energy",
      "immunity",
      "inflammation"
    ],
    "safetyNotes": [
      "Potential medication interactions include: Immunosuppressants, Blood thinners.",
      "Quality matters (test for contaminants).",
      "Use clinician guidance with: Autoimmune conditions (use caution)."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk",
      "autoimmune"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "st-johns-wort": {
    "supplementId": "st-johns-wort",
    "supplementName": "St. John's Wort (Hypericum perforatum)",
    "aliases": [
      "hypericum perforatum",
      "saint johns wort",
      "st johns wort",
      "St. John's Wort",
      "St. John's Wort Hypericum perforatum",
      "St. Johns Wort (Hypericum perforatum)"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed"
    ],
    "evidenceSummary": "St. John's Wort has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "anxiety",
      "depression",
      "menopause",
      "mood",
      "mood support"
    ],
    "safetyNotes": [
      "Causes photosensitivity (sun sensitivity).",
      "Many drug interactions.",
      "Potential medication interactions include: Birth control pills, Blood thinners, SSRIs/SNRIs.",
      "This herb has clinically important drug-interaction potential and should be reviewed carefully with a clinician.",
      "Use clinician guidance with: Bipolar disorder, Pregnancy, Breastfeeding."
    ],
    "safetyFlags": [
      "pregnancy",
      "breastfeeding",
      "drug-interaction",
      "bleeding-risk",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "St. John's Wort and Depression: In Depth",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/st-johns-wort-and-depression-in-depth",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "taurine": {
    "supplementId": "taurine",
    "supplementName": "Taurine",
    "aliases": [],
    "categories": [
      "amino-acid"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Taurine has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "anxiety",
      "athletic performance",
      "calm",
      "heart health",
      "sleep"
    ],
    "safetyNotes": [
      "Ironically calming despite being in energy drinks.",
      "Potential medication interactions include: Lithium.",
      "Use clinician guidance with: Generally safe for all.",
      "Very safe."
    ],
    "safetyFlags": [
      "drug-interaction"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements for Exercise and Athletic Performance",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "tongkat-ali": {
    "supplementId": "tongkat-ali",
    "supplementName": "Tongkat Ali / Longjack (Eurycoma longifolia)",
    "aliases": [
      "Eurycoma longifolia",
      "Longjack (Eurycoma longifolia)",
      "Longjack Eurycoma longifolia",
      "tongkat ali",
      "Tongkat Ali / Longjack",
      "Tongkat Ali / Longjack Eurycoma longifolia"
    ],
    "categories": [
      "adaptogen",
      "herb"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Tongkat Ali / Longjack has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "body composition",
      "cortisol",
      "energy",
      "fatigue",
      "libido",
      "sexual health",
      "testosterone"
    ],
    "safetyNotes": [
      "May cause restlessness or insomnia.",
      "May increase aggression in some.",
      "Potential medication interactions include: Blood pressure medications, Diabetes medications, Immunosuppressants.",
      "Use clinician guidance with: Hormone-sensitive cancers, Pregnancy, Breastfeeding."
    ],
    "safetyFlags": [
      "pregnancy",
      "breastfeeding",
      "drug-interaction",
      "blood-pressure",
      "blood-sugar",
      "autoimmune"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "tribulus": {
    "supplementId": "tribulus",
    "supplementName": "Tribulus Terrestris (Gokshura)",
    "aliases": [
      "Gokshura",
      "tribulus",
      "Tribulus Terrestris",
      "Tribulus Terrestris Gokshura"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging",
      "traditional"
    ],
    "evidenceSummary": "Tribulus Terrestris has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "fertility",
      "kidney stones",
      "libido",
      "male reproductive",
      "prostate",
      "sexual health",
      "sperm quality",
      "testosterone"
    ],
    "safetyNotes": [
      "Potential medication interactions include: Diabetes medications, Blood pressure medications, Lithium.",
      "Recent reviews report mixed outcomes on sexual function.",
      "Testosterone increases are inconsistent in men with normal baseline levels.",
      "Use clinician guidance with: Hormone-sensitive cancers, Pregnancy, Breastfeeding."
    ],
    "safetyFlags": [
      "pregnancy",
      "breastfeeding",
      "drug-interaction",
      "blood-pressure",
      "blood-sugar"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "trikatu": {
    "supplementId": "trikatu",
    "supplementName": "Trikatu",
    "aliases": [],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging",
      "traditional"
    ],
    "evidenceSummary": "Trikatu has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "absorption",
      "bloating",
      "digestion",
      "metabolism",
      "respiratory"
    ],
    "safetyNotes": [
      "May cause heartburn or GI irritation.",
      "Potential medication interactions include: May enhance absorption of other medications.",
      "Use clinician guidance with: Hyperacidity, Ulcers, Inflammatory GI conditions.",
      "Very heating."
    ],
    "safetyFlags": [
      "pregnancy"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "triphala": {
    "supplementId": "triphala",
    "supplementName": "Triphala",
    "aliases": [],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging",
      "traditional"
    ],
    "evidenceSummary": "Triphala has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "antioxidant",
      "detox",
      "digestion",
      "gut health",
      "longevity",
      "regularity"
    ],
    "safetyNotes": [
      "May cause loose stools initially - start with lower dose.",
      "Potential medication interactions include: May affect absorption of other medications - take separately.",
      "Use clinician guidance with: Pregnancy, Diarrhea, Severe debility (too cleansing)."
    ],
    "safetyFlags": [
      "pregnancy"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "tryptophan": {
    "supplementId": "tryptophan",
    "supplementName": "L-Tryptophan",
    "aliases": [
      "tryptophan"
    ],
    "categories": [
      "amino-acid"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "L-Tryptophan has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "mood",
      "relaxation",
      "sleep",
      "stress"
    ],
    "safetyNotes": [
      "Potential medication interactions include: Antidepressants, Sedatives, MAOIs.",
      "Similar precautions to 5-HTP.",
      "Use clinician guidance with: On serotonergic medications."
    ],
    "safetyFlags": [
      "drug-interaction",
      "sedation"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements for Exercise and Athletic Performance",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "tulsi": {
    "supplementId": "tulsi",
    "supplementName": "Tulsi / Holy Basil (Ocimum sanctum)",
    "aliases": [
      "holy basil",
      "Holy Basil (Ocimum sanctum)",
      "Holy Basil Ocimum sanctum",
      "ocimum sanctum",
      "ocimum tenuiflorum",
      "tulasi",
      "tulsi",
      "Tulsi / Holy Basil",
      "Tulsi / Holy Basil Ocimum sanctum"
    ],
    "categories": [
      "adaptogen",
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Tulsi / Holy Basil has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "adaptogen",
      "anxiety",
      "blood sugar",
      "immunity",
      "metabolic support",
      "respiratory",
      "stress",
      "stress support"
    ],
    "safetyNotes": [
      "May lower blood sugar - monitor if diabetic.",
      "Potential medication interactions include: Blood thinners, Diabetes medications.",
      "Use clinician guidance with: Trying to conceive (may have anti-fertility effects), Before surgery."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "bleeding-risk",
      "blood-sugar"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "turkey-tail": {
    "supplementId": "turkey-tail",
    "supplementName": "Turkey Tail (Trametes versicolor)",
    "aliases": [
      "Trametes versicolor",
      "turkey tail",
      "Turkey Tail Trametes versicolor"
    ],
    "categories": [
      "mushroom"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Turkey Tail has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "digestion",
      "immunity",
      "longevity"
    ],
    "safetyNotes": [
      "May cause mild digestive changes.",
      "Potential medication interactions include: Immunosuppressants.",
      "Use clinician guidance with: Organ transplant recipients on immunosuppressants."
    ],
    "safetyFlags": [
      "drug-interaction"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "turmeric": {
    "supplementId": "turmeric",
    "supplementName": "Turmeric",
    "aliases": [
      "curcuma longa",
      "curcumin",
      "tumeric"
    ],
    "categories": [
      "antioxidant",
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Turmeric has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "antioxidant",
      "brain health",
      "digestion",
      "inflammation",
      "joint comfort",
      "joint pain",
      "post training recovery"
    ],
    "safetyNotes": [
      "Can upset stomach in large amounts.",
      "May thin blood at high doses.",
      "Potential medication interactions include: Blood thinners, Diabetes medications, Acid-reducing drugs.",
      "Use clinician guidance with: Gallbladder disease, Before surgery, Pregnancy (high doses)."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "bleeding-risk",
      "blood-sugar"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Turmeric",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/turmeric",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "turmeric-curcumin": {
    "supplementId": "turmeric-curcumin",
    "supplementName": "Turmeric / Curcumin",
    "aliases": [
      "curcuma longa",
      "curcumin",
      "tumeric",
      "Turmeric"
    ],
    "categories": [
      "antioxidant",
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Curcumin has mixed but growing clinical evidence for inflammation-related wellness outcomes; formulations influence absorption.",
    "typicalUseCases": [
      "antioxidant",
      "brain health",
      "digestion",
      "exercise recovery",
      "general inflammation support",
      "inflammation",
      "joint comfort",
      "joint pain"
    ],
    "safetyNotes": [
      "Can thin blood.",
      "May cause GI upset at high doses.",
      "Potential interactions can include anticoagulant and antiplatelet medications.",
      "Potential medication interactions include: Blood thinners, Diabetes medications, Acid-reducing drugs.",
      "Use caution with gallbladder concerns unless a clinician advises otherwise."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "bleeding-risk",
      "blood-sugar",
      "liver",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "NCCIH: Turmeric",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/turmeric",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Turmeric",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/turmeric",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "uridine": {
    "supplementId": "uridine",
    "supplementName": "Uridine Monophosphate",
    "aliases": [
      "uridine"
    ],
    "categories": [
      "other"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "Uridine Monophosphate has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "brain health",
      "dopamine",
      "focus",
      "memory",
      "motivation"
    ],
    "safetyNotes": [
      "Can deplete Folate/B12.",
      "Potential medication interactions include: None significant.",
      "Use clinician guidance with: History of cancer (supports cell growth - consult doctor)."
    ],
    "safetyFlags": [
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "valerian": {
    "supplementId": "valerian",
    "supplementName": "Valerian Root (Valeriana officinalis)",
    "aliases": [
      "valerian",
      "valerian root",
      "Valerian Root Valeriana officinalis",
      "valeriana",
      "valeriana officinalis"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "traditional"
    ],
    "evidenceSummary": "Valerian has mixed evidence for sleep outcomes, with some studies suggesting small benefits for sleep quality or latency.",
    "typicalUseCases": [
      "anxiety",
      "calm support",
      "insomnia",
      "relaxation",
      "sleep",
      "sleep support"
    ],
    "safetyNotes": [
      "Distinct unpleasant smell.",
      "May cause next-day grogginess.",
      "Potential medication interactions include: Sedatives, Benzodiazepines, Alcohol.",
      "Sedation and next-day drowsiness can occur, especially when combined with other sedative agents.",
      "Use clinician guidance with: Pregnancy, Breastfeeding, Operating machinery after taking."
    ],
    "safetyFlags": [
      "pregnancy",
      "breastfeeding",
      "drug-interaction",
      "sedation"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Valerian: Usefulness and Safety",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/valerian",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "vitamin-a": {
    "supplementId": "vitamin-a",
    "supplementName": "Vitamin A (Retinol)",
    "aliases": [
      "beta carotene",
      "retinol",
      "vit a",
      "vitamin a",
      "Vitamin A Retinol"
    ],
    "categories": [
      "vitamin"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Vitamin A is essential for vision, immune function, and epithelial tissue health; supplementation is most useful when intake is inadequate.",
    "typicalUseCases": [
      "eyes",
      "immune support",
      "immunity",
      "longevity",
      "skin",
      "skin support",
      "vision",
      "vision support"
    ],
    "safetyNotes": [
      "Beta-carotene is safer for long-term use.",
      "High preformed vitamin A intake can increase toxicity risk, including liver effects.",
      "High-dose retinol can be toxic.",
      "Potential medication interactions include: Retinoid medications, Blood thinners.",
      "Pregnancy use should avoid excessive retinol and follow prenatal guidance."
    ],
    "safetyFlags": [
      "pregnancy",
      "drug-interaction",
      "bleeding-risk",
      "liver",
      "general-caution"
    ],
    "dosageRangeNote": "Adult intake targets are typically 700-900 mcg RAE/day; high-dose retinol should stay below upper limits unless clinician-directed.",
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Vitamin A and Carotenoids - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/VitaminA-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "vitamin-b1": {
    "supplementId": "vitamin-b1",
    "supplementName": "Vitamin B1 (Thiamine)",
    "aliases": [
      "thiamin",
      "thiamine",
      "vit b1",
      "vitamin b1",
      "Vitamin B1 Thiamine"
    ],
    "categories": [
      "vitamin"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Thiamin supports carbohydrate metabolism and nervous system function, with supplementation most relevant when status is low.",
    "typicalUseCases": [
      "energy",
      "energy metabolism support",
      "focus",
      "heart health",
      "metabolism",
      "nervous system support"
    ],
    "safetyNotes": [
      "Deficiency risk can be higher in people with low intake, malabsorption, or heavy alcohol use.",
      "Excess is excreted in urine.",
      "Generally very safe.",
      "Potential medication interactions include: Diuretics, Certain antibiotics.",
      "Use clinician guidance with: Generally safe for all."
    ],
    "safetyFlags": [
      "general-caution"
    ],
    "dosageRangeNote": "Adult RDAs are commonly around 1.1-1.2 mg/day; supplemental doses vary by context.",
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Thiamin - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Thiamin-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "vitamin-b12": {
    "supplementId": "vitamin-b12",
    "supplementName": "Vitamin B12 (Methylcobalamin)",
    "aliases": [
      "cobalamin",
      "cyanocobalamin",
      "methylcobalamin",
      "vit b12",
      "vitamin b12",
      "Vitamin B12 Methylcobalamin"
    ],
    "categories": [
      "vitamin"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Vitamin B12 is essential for neurologic function and blood formation, with supplementation most relevant when intake or absorption is limited.",
    "typicalUseCases": [
      "brain health",
      "energy",
      "energy metabolism support",
      "fatigue",
      "mood",
      "nerve health",
      "vegan",
      "vegan nutrition support"
    ],
    "safetyNotes": [
      "Cyanocobalamin less effective than methylcobalamin.",
      "Potential medication interactions include: Metformin (depletes B12), Acid-reducing drugs.",
      "Use clinician guidance with: Generally safe for everyone.",
      "Very safe even at high doses."
    ],
    "safetyFlags": [
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "NIH ODS: Vitamin B12 Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Vitamin B12 - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "vitamin-c": {
    "supplementId": "vitamin-c",
    "supplementName": "Vitamin C (Ascorbic Acid)",
    "aliases": [
      "ascorbic acid",
      "vit c",
      "vitamin c",
      "Vitamin C Ascorbic Acid"
    ],
    "categories": [
      "antioxidant",
      "vitamin"
    ],
    "evidenceStrengthTags": [
      "well-supported",
      "mixed"
    ],
    "evidenceSummary": "Vitamin C has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "antioxidant",
      "antioxidant support",
      "cold",
      "collagen",
      "immune support",
      "immunity",
      "iron absorption",
      "skin"
    ],
    "safetyNotes": [
      "High doses may cause GI upset or diarrhea.",
      "Kidney stone risk with very high doses in susceptible individuals.",
      "Potential medication interactions include: May affect some chemotherapy drugs, Increases iron absorption.",
      "Use clinician guidance with: Hemochromatosis (iron overload), History of kidney stones (high doses)."
    ],
    "safetyFlags": [
      "kidney",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Vitamin C - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "vitamin-d3": {
    "supplementId": "vitamin-d3",
    "supplementName": "Vitamin D3 (Cholecalciferol)",
    "aliases": [
      "cholecalciferol",
      "vit d3",
      "vitamin d",
      "vitamin d3",
      "Vitamin D3 Cholecalciferol"
    ],
    "categories": [
      "vitamin"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Vitamin D has strong evidence for bone and mineral metabolism roles; broader outcomes depend on baseline status and dosing strategy.",
    "typicalUseCases": [
      "bone health",
      "bone health support",
      "depression",
      "hormonal balance",
      "immune support",
      "immunity",
      "mood",
      "muscle"
    ],
    "safetyNotes": [
      "Avoid routine high-dose supplementation without clear risk or deficiency.",
      "Can cause toxicity if overdone.",
      "Excessive long-term intake can raise the risk of hypercalcemia.",
      "Potential medication interactions include: Thiazide diuretics, Steroids, Weight loss drugs.",
      "Use clinician guidance with: Hypercalcemia, Kidney disease, Sarcoidosis."
    ],
    "safetyFlags": [
      "kidney",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "NIH ODS: Vitamin D Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/VitaminD-Consumer/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Vitamin D - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "vitamin-e": {
    "supplementId": "vitamin-e",
    "supplementName": "Vitamin E",
    "aliases": [
      "alpha tocopherol",
      "tocopherol",
      "vit e",
      "vitamin e"
    ],
    "categories": [
      "antioxidant",
      "vitamin"
    ],
    "evidenceStrengthTags": [
      "well-supported",
      "mixed"
    ],
    "evidenceSummary": "Vitamin E is an essential antioxidant nutrient; supplementation benefits are clearest when deficiency is present, while broad prevention outcomes are mixed.",
    "typicalUseCases": [
      "antioxidant",
      "antioxidant support",
      "cell protection support",
      "heart health",
      "immunity",
      "skin"
    ],
    "safetyNotes": [
      "High doses may increase bleeding risk.",
      "High-dose vitamin E may increase bleeding risk, especially with anticoagulant or antiplatelet therapy.",
      "Potential medication interactions include: Blood thinners, Chemotherapy.",
      "Use clinician guidance with: Bleeding disorders, Before surgery."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk",
      "general-caution"
    ],
    "dosageRangeNote": "Adult RDA is 15 mg/day alpha-tocopherol; high supplemental intakes should be clinician-reviewed.",
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Vitamin E - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/VitaminE-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "vitamin-e-tocotrienol": {
    "supplementId": "vitamin-e-tocotrienol",
    "supplementName": "Vitamin E (Tocotrienols)",
    "aliases": [
      "Tocotrienols",
      "Vitamin E",
      "vitamin e tocotrienol",
      "Vitamin E Tocotrienols"
    ],
    "categories": [
      "vitamin"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Vitamin E has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "antioxidant",
      "arteries",
      "brain health",
      "cholesterol",
      "liver"
    ],
    "safetyNotes": [
      "Blood thinning effects.",
      "Potential medication interactions include: Blood thinners (Warfarin).",
      "Use clinician guidance with: Before surgery."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "vitamin-k2": {
    "supplementId": "vitamin-k2",
    "supplementName": "Vitamin K2 (MK-7)",
    "aliases": [
      "menaquinone",
      "mk-4",
      "mk-7",
      "mk4",
      "mk7",
      "vitamin k",
      "vitamin k2",
      "Vitamin K2 MK-7"
    ],
    "categories": [
      "vitamin"
    ],
    "evidenceStrengthTags": [
      "well-supported",
      "mixed"
    ],
    "evidenceSummary": "Vitamin K supports normal blood clotting and bone-related protein activation, with clinical response depending on baseline status and form.",
    "typicalUseCases": [
      "arterial health",
      "bone health",
      "bone support",
      "calcium",
      "calcium metabolism support",
      "cardiovascular",
      "teeth"
    ],
    "safetyNotes": [
      "K2 does not affect blood clotting like K1.",
      "Potential medication interactions include: Warfarin and similar anticoagulants.",
      "Use clinician guidance with: On warfarin or similar blood thinners (consult doctor).",
      "Vitamin K can alter anticoagulant response, especially with warfarin, so intake changes should be coordinated with clinicians."
    ],
    "safetyFlags": [
      "drug-interaction",
      "bleeding-risk",
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Vitamin K - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/VitaminK-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "vitex": {
    "supplementId": "vitex",
    "supplementName": "Vitex (Chasteberry)",
    "aliases": [
      "Chasteberry",
      "vitex",
      "Vitex Chasteberry"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "well-supported"
    ],
    "evidenceSummary": "Vitex has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.",
    "typicalUseCases": [
      "cycle regulation",
      "female reproductive",
      "fertility",
      "hormonal balance",
      "ovulation",
      "pms",
      "progesterone",
      "sexual health"
    ],
    "safetyNotes": [
      "Discontinue once pregnancy is confirmed.",
      "May cause dopamine-related effects.",
      "Potential medication interactions include: Dopamine antagonists, Antipsychotics, Hormonal contraceptives.",
      "Use clinician guidance with: On dopamine-blocking medications, Pregnancy (use for conception only)."
    ],
    "safetyFlags": [
      "pregnancy"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "white-tea-silver-needle": {
    "supplementId": "white-tea-silver-needle",
    "supplementName": "White Tea - Silver Needle (Camellia sinensis)",
    "aliases": [
      "Camellia sinensis",
      "White Tea - Silver Needle Camellia sinensis",
      "white tea silver needle"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "White Tea - Silver Needle has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "antioxidant",
      "energy",
      "heart health",
      "metabolism",
      "skin"
    ],
    "safetyNotes": [
      "Contains caffeine (lower than green/black tea).",
      "Potential medication interactions include: Stimulants (additive caffeine).",
      "Use clinician guidance with: Severe caffeine sensitivity."
    ],
    "safetyFlags": [
      "stimulant"
    ],
    "citations": [
      {
        "title": "White Tea Benefits - Healthline",
        "publisher": "healthline.com",
        "url": "https://www.healthline.com/nutrition/white-tea-benefits",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Tea\xE2\u20AC\u2122s anti-obesity properties - PMC",
        "publisher": "National Institutes of Health",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10563719",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "white-tea-white-peony": {
    "supplementId": "white-tea-white-peony",
    "supplementName": "White Tea - White Peony (Bai Mudan) (Camellia sinensis)",
    "aliases": [
      "Bai Mudan",
      "Camellia sinensis",
      "White Tea - White Peony Bai Mudan Camellia sinensis",
      "white tea white peony"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "mixed",
      "emerging"
    ],
    "evidenceSummary": "White Tea - White Peony has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.",
    "typicalUseCases": [
      "antioxidant",
      "heart health",
      "immunity",
      "metabolism"
    ],
    "safetyNotes": [
      "Contains caffeine.",
      "Potential medication interactions include: Stimulants (additive caffeine).",
      "Use clinician guidance with: Severe caffeine sensitivity."
    ],
    "safetyFlags": [
      "stimulant"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Green Tea Knowledge - PMC",
        "publisher": "National Institutes of Health",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11899301",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "yellow-tea-huang-ya": {
    "supplementId": "yellow-tea-huang-ya",
    "supplementName": "Yellow Tea - Huang Ya (Camellia sinensis)",
    "aliases": [
      "Camellia sinensis",
      "Yellow Tea - Huang Ya Camellia sinensis",
      "yellow tea huang ya"
    ],
    "categories": [
      "herb"
    ],
    "evidenceStrengthTags": [
      "emerging"
    ],
    "evidenceSummary": "Yellow Tea - Huang Ya is informed by traditional use and emerging research, while higher-quality clinical evidence remains limited.",
    "typicalUseCases": [
      "antioxidant",
      "liver",
      "metabolism",
      "weight"
    ],
    "safetyNotes": [
      "Contains caffeine.",
      "Potential medication interactions include: Stimulants (additive caffeine).",
      "Use clinician guidance with: Severe caffeine sensitivity."
    ],
    "safetyFlags": [
      "stimulant"
    ],
    "citations": [
      {
        "title": "Herbs at a Glance",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/herbsataglance",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Yellow Tea Supplement - PMC",
        "publisher": "National Institutes of Health",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5793303",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  },
  "zinc": {
    "supplementId": "zinc",
    "supplementName": "Zinc",
    "aliases": [
      "zinc picolinate",
      "zink",
      "zn"
    ],
    "categories": [
      "mineral"
    ],
    "evidenceStrengthTags": [
      "well-supported",
      "mixed"
    ],
    "evidenceSummary": "Zinc is essential for immune and enzymatic function; deficiency correction is well supported while excess can cause adverse effects.",
    "typicalUseCases": [
      "acne",
      "cold",
      "fertility",
      "immune support",
      "immunity",
      "libido",
      "reproductive health support",
      "semen volume"
    ],
    "safetyNotes": [
      "Can deplete copper if taken long-term.",
      "Do not exceed 40mg daily long-term.",
      "Long-term high-dose use can reduce copper status.",
      "Potential medication interactions include: Antibiotics (take separately), Diuretics, Penicillamine.",
      "Use clinician guidance with: Generally safe at recommended doses."
    ],
    "safetyFlags": [
      "general-caution"
    ],
    "citations": [
      {
        "title": "Using Dietary Supplements Wisely",
        "publisher": "National Center for Complementary and Integrative Health",
        "url": "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplement Fact Sheets",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/list-all/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "NIH ODS: Zinc Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Zinc-Consumer/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Zinc - Health Professional Fact Sheet",
        "publisher": "NIH Office of Dietary Supplements",
        "url": "https://ods.od.nih.gov/factsheets/Zinc-HealthProfessional/",
        "accessedAt": "2026-02-10"
      },
      {
        "title": "Dietary Supplements",
        "publisher": "U.S. Food and Drug Administration",
        "url": "https://www.fda.gov/food/dietary-supplements",
        "accessedAt": "2026-02-10"
      }
    ]
  }
};

// src/data/supplementKnowledge.ts
var normalizeKnowledgeKey = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ");
var supplementKnowledge = supplementKnowledgeGenerated;
var supplementKnowledgeByName = /* @__PURE__ */ new Map();
for (const entry of Object.values(supplementKnowledge)) {
  supplementKnowledgeByName.set(normalizeKnowledgeKey(entry.supplementName), entry);
  for (const alias of entry.aliases) {
    supplementKnowledgeByName.set(normalizeKnowledgeKey(alias), entry);
  }
}
function getSupplementKnowledgeById(id) {
  return supplementKnowledge[id];
}
function getKnowledgeBenefitSearchTerms(entry) {
  const tokens = /* @__PURE__ */ new Set();
  tokens.add(entry.supplementName);
  entry.aliases.forEach((alias) => tokens.add(alias));
  entry.categories.forEach((category) => tokens.add(category));
  entry.typicalUseCases.forEach((goal) => tokens.add(goal));
  entry.evidenceStrengthTags.forEach((tag) => tokens.add(tag));
  tokens.add(entry.evidenceSummary);
  if (entry.dosageRangeNote) {
    tokens.add(entry.dosageRangeNote);
  }
  return Array.from(tokens);
}
function getKnowledgeSafetySearchTerms(entry) {
  const tokens = /* @__PURE__ */ new Set();
  entry.safetyNotes.forEach((note) => tokens.add(note));
  entry.safetyFlags.forEach((flag) => tokens.add(flag));
  return Array.from(tokens);
}

// src/utils/supplementCanonical.ts
var normalizeCanonicalText = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ");
var evidenceScore = {
  strong: 3,
  moderate: 2,
  limited: 1
};
var getSupplementPreferenceScore = (supplement, canonicalKey) => {
  const nameKey = normalizeCanonicalText(supplement.name);
  const idKey = normalizeCanonicalText(supplement.id.replace(/-/g, " "));
  let score = evidenceScore[supplement.evidence] * 4;
  score += (supplement.benefits?.length || 0) * 0.2;
  score += (supplement.goals?.length || 0) * 0.15;
  score += (supplement.systems?.length || 0) * 0.1;
  if (!supplement.name.includes("(")) score += 0.8;
  if (nameKey === canonicalKey) score += 2.5;
  if (idKey === canonicalKey) score += 2;
  return score;
};
function getCanonicalSupplementName(supplement) {
  return normalizeSupplementName(supplement.id).trim() || supplement.id;
}
function getCanonicalSupplementKey(supplement) {
  return normalizeCanonicalText(getCanonicalSupplementName(supplement));
}
function choosePreferredCanonicalSupplement(a, b) {
  const canonicalKey = getCanonicalSupplementKey(a);
  const aScore = getSupplementPreferenceScore(a, canonicalKey);
  const bScore = getSupplementPreferenceScore(b, canonicalKey);
  if (aScore === bScore) {
    return a.id.localeCompare(b.id) <= 0 ? a : b;
  }
  return aScore > bScore ? a : b;
}
function dedupeSupplementsByCanonical(supplements2) {
  const byCanonical = /* @__PURE__ */ new Map();
  for (const supplement of supplements2) {
    const key = getCanonicalSupplementKey(supplement);
    const existing = byCanonical.get(key);
    if (!existing) {
      byCanonical.set(key, supplement);
      continue;
    }
    byCanonical.set(key, choosePreferredCanonicalSupplement(existing, supplement));
  }
  return Array.from(byCanonical.values());
}

// src/utils/supplementSearchEngine.ts
var STOP_TOKENS = /* @__PURE__ */ new Set([
  "and",
  "for",
  "the",
  "with",
  "from",
  "that",
  "this",
  "your",
  "my",
  "any",
  "all",
  "help",
  "support"
]);
var SAFETY_INTENT_TOKENS = /* @__PURE__ */ new Set([
  "safe",
  "safety",
  "risk",
  "risky",
  "warning",
  "warnings",
  "contraindication",
  "contraindications",
  "interaction",
  "interactions",
  "avoid",
  "pregnancy",
  "pregnant",
  "breastfeeding",
  "lactation",
  "side",
  "effect",
  "effects"
]);
var FERTILITY_TOKENS = /* @__PURE__ */ new Set([
  "fertility",
  "conception",
  "pregnancy",
  "pregnant",
  "ovulation",
  "sperm",
  "reproductive",
  "libido"
]);
var normalizeSearchText = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ");
var tokenize = (value) => normalizeSearchText(value).split(" ").filter(Boolean);
var containsToken = (terms, token) => terms.some((term) => term.includes(token));
var levenshteinDistance = (a, b) => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
};
var similarity = (a, b) => 1 - levenshteinDistance(a, b) / Math.max(a.length, b.length, 1);
var addReason = (reasons, seen, code, label) => {
  if (seen.has(code)) return;
  seen.add(code);
  reasons.push({ code, label });
};
function isSafetyIntentQuery(query) {
  const tokens = tokenize(query);
  return tokens.some((token) => SAFETY_INTENT_TOKENS.has(token));
}
function getSupplementSearchCandidates(supplement) {
  const knowledge = getSupplementKnowledgeById(supplement.id);
  const candidates = /* @__PURE__ */ new Set();
  candidates.add(supplement.name.toLowerCase());
  candidates.add(supplement.id.toLowerCase().replace(/-/g, " "));
  for (const alias of knowledge?.aliases || []) {
    candidates.add(alias.toLowerCase());
  }
  return Array.from(candidates);
}
var getBestTextMatch = (query, values) => {
  if (!query) return { kind: "none", value: "" };
  const normalizedValues = values.map((value) => ({ raw: value, normalized: normalizeSearchText(value) })).filter((value) => value.normalized.length > 0);
  const exact = normalizedValues.find((value) => value.normalized === query);
  if (exact) return { kind: "exact", value: exact.raw };
  const prefix = normalizedValues.find((value) => value.normalized.startsWith(query));
  if (prefix) return { kind: "prefix", value: prefix.raw };
  const contains = normalizedValues.find((value) => value.normalized.includes(query));
  if (contains) return { kind: "contains", value: contains.raw };
  if (query.length < 4) return { kind: "none", value: "" };
  let bestScore = 0;
  let bestValue = "";
  for (const value of normalizedValues) {
    const score = similarity(query, value.normalized);
    if (score > bestScore) {
      bestScore = score;
      bestValue = value.raw;
    }
  }
  if (bestScore >= 0.82) {
    return { kind: "fuzzy", value: bestValue };
  }
  return { kind: "none", value: "" };
};
var scoreTextMatch = (kind, weights) => {
  if (kind === "exact") return weights.exact;
  if (kind === "prefix") return weights.prefix;
  if (kind === "contains") return weights.contains;
  if (kind === "fuzzy") return weights.fuzzy;
  return 0;
};
var formatIdLabel = (value) => value.replace(/-/g, " ");
function searchSupplementsWithScores(query, supplements2, options = {}) {
  const normalizedQuery = normalizeSearchText(query);
  const queryTokens = tokenize(query).filter((token) => token.length > 1 && !STOP_TOKENS.has(token));
  const queryGoalIds = normalizeGoals([...queryTokens, normalizedQuery].filter(Boolean));
  const querySystemIds = normalizeSystems([...queryTokens, normalizedQuery].filter(Boolean));
  const normalizedGoal = normalizeGoals(options.goal ? [options.goal] : [])[0];
  const rawGoalTokens = options.goal ? tokenize(options.goal) : [];
  const hasQuery = normalizedQuery.length > 0;
  const hasGoal = Boolean(normalizedGoal);
  const safetyIntent = isSafetyIntentQuery(query);
  const fertilitySignal = [...queryTokens, ...rawGoalTokens].some((token) => FERTILITY_TOKENS.has(token));
  const results = [];
  for (const supplement of supplements2) {
    const knowledge = getSupplementKnowledgeById(supplement.id);
    const reasons = [];
    const seenReasons = /* @__PURE__ */ new Set();
    let textScore = 0;
    let goalScore = 0;
    let matchedGoal = false;
    const nameCandidates = [supplement.name, supplement.id.replace(/-/g, " ")];
    const aliasCandidates = knowledge?.aliases || [];
    const nameMatch = getBestTextMatch(normalizedQuery, nameCandidates);
    const aliasMatch = getBestTextMatch(normalizedQuery, aliasCandidates);
    if (hasQuery) {
      const nameWeight = scoreTextMatch(nameMatch.kind, {
        exact: 140,
        prefix: 108,
        contains: 80,
        fuzzy: 60
      });
      if (nameWeight > 0) {
        textScore += nameWeight;
        addReason(reasons, seenReasons, `name-${nameMatch.kind}`, `Name match: ${nameMatch.value}`);
      }
      const aliasWeight = scoreTextMatch(aliasMatch.kind, {
        exact: 128,
        prefix: 96,
        contains: 70,
        fuzzy: 52
      });
      if (aliasWeight > 0) {
        textScore += aliasWeight;
        addReason(reasons, seenReasons, `alias-${aliasMatch.kind}`, `Alias match: ${aliasMatch.value}`);
      }
    }
    const normalizedBenefits = supplement.benefits.map((benefit) => normalizeSearchText(benefit));
    const normalizedDescription = normalizeSearchText(supplement.description);
    const normalizedTraditionalUse = normalizeSearchText(supplement.traditionalUse || "");
    const normalizedGoals = normalizeGoals(supplement.goals);
    const normalizedSystems = normalizeSystems(supplement.systems);
    const normalizedKnowledgeGoals = normalizeGoals(knowledge?.typicalUseCases || []);
    const benefitTerms = knowledge ? getKnowledgeBenefitSearchTerms(knowledge).map(normalizeSearchText) : [];
    const safetyTerms = knowledge ? getKnowledgeSafetySearchTerms(knowledge).map(normalizeSearchText) : [];
    for (const token of queryTokens) {
      if (token.length < 3) continue;
      if (containsToken(normalizedBenefits, token)) {
        textScore += 10;
        addReason(reasons, seenReasons, `benefit-${token}`, `Benefit: ${token}`);
      }
      if (normalizedDescription.includes(token) || normalizedTraditionalUse.includes(token)) {
        textScore += 5;
      }
      if (containsToken(benefitTerms, token)) {
        textScore += 8;
      }
      if (containsToken(safetyTerms, token)) {
        textScore += safetyIntent ? 8 : 4;
        if (safetyIntent) {
          addReason(reasons, seenReasons, `safety-${token}`, `Safety: ${token}`);
        }
      }
    }
    for (const goalId of queryGoalIds) {
      if (normalizedGoals.includes(goalId)) {
        goalScore += 30;
        matchedGoal = true;
        addReason(reasons, seenReasons, `goal-${goalId}`, `Goal: ${formatIdLabel(goalId)}`);
      }
      if (normalizedKnowledgeGoals.includes(goalId)) {
        goalScore += 24;
        matchedGoal = true;
        addReason(reasons, seenReasons, `use-case-${goalId}`, `Use-case: ${formatIdLabel(goalId)}`);
      }
    }
    for (const systemId of querySystemIds) {
      if (normalizedSystems.includes(systemId)) {
        textScore += 14;
        addReason(reasons, seenReasons, `system-${systemId}`, `System: ${formatIdLabel(systemId)}`);
      }
    }
    if (hasGoal && normalizedGoal) {
      if (normalizedGoals.includes(normalizedGoal)) {
        goalScore += 36;
        matchedGoal = true;
        addReason(reasons, seenReasons, `goal-filter-${normalizedGoal}`, `Goal: ${formatIdLabel(normalizedGoal)}`);
      } else if (normalizedKnowledgeGoals.includes(normalizedGoal)) {
        goalScore += 28;
        matchedGoal = true;
        addReason(
          reasons,
          seenReasons,
          `goal-filter-use-case-${normalizedGoal}`,
          `Use-case: ${formatIdLabel(normalizedGoal)}`
        );
      }
    }
    if (fertilitySignal && options.gender) {
      const isMaleSpecific = supplement.goals.some(
        (goal) => ["male-reproductive", "sperm-quality", "testosterone"].includes(goal)
      );
      const isFemaleSpecific = supplement.goals.some(
        (goal) => ["female-reproductive", "ovulation", "menstrual-health", "pcos", "menopause"].includes(goal)
      );
      if (options.gender === "male" && isFemaleSpecific && !isMaleSpecific) {
        continue;
      }
      if (options.gender === "female" && isMaleSpecific && !isFemaleSpecific) {
        continue;
      }
    }
    if (hasGoal && !matchedGoal) {
      continue;
    }
    const score = textScore + goalScore;
    if (hasQuery && score <= 0) {
      continue;
    }
    results.push({
      supplement,
      score,
      reasons: reasons.slice(0, 4),
      textScore,
      goalScore
    });
  }
  const canonicalResults = /* @__PURE__ */ new Map();
  for (const result of results) {
    const canonicalKey = getCanonicalSupplementKey(result.supplement);
    const existing = canonicalResults.get(canonicalKey);
    if (!existing) {
      canonicalResults.set(canonicalKey, result);
      continue;
    }
    const mergedReasons = Array.from(/* @__PURE__ */ new Set([
      ...existing.reasons.map((reason) => `${reason.code}:${reason.label}`),
      ...result.reasons.map((reason) => `${reason.code}:${reason.label}`)
    ])).map((entry) => {
      const [code, ...labelParts] = entry.split(":");
      return { code, label: labelParts.join(":") };
    });
    const shouldReplace = result.score > existing.score || result.score === existing.score && result.goalScore > existing.goalScore || result.score === existing.score && result.goalScore === existing.goalScore && choosePreferredCanonicalSupplement(existing.supplement, result.supplement).id === result.supplement.id;
    if (shouldReplace) {
      canonicalResults.set(canonicalKey, {
        ...result,
        reasons: mergedReasons.slice(0, 4)
      });
    } else {
      canonicalResults.set(canonicalKey, {
        ...existing,
        reasons: mergedReasons.slice(0, 4)
      });
    }
  }
  const dedupedResults = Array.from(canonicalResults.values());
  dedupedResults.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.goalScore !== a.goalScore) return b.goalScore - a.goalScore;
    if (b.textScore !== a.textScore) return b.textScore - a.textScore;
    return a.supplement.name.localeCompare(b.supplement.name);
  });
  return dedupedResults;
}
function suggestClosestSupplementTerm(query, supplements2) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery || normalizedQuery.length < 3) {
    return null;
  }
  const candidates = /* @__PURE__ */ new Map();
  for (const supplement of supplements2) {
    candidates.set(normalizeSearchText(supplement.name), supplement.name);
    for (const alias of getSupplementSearchCandidates(supplement)) {
      candidates.set(normalizeSearchText(alias), alias);
    }
  }
  let bestValue = null;
  let bestScore = 0;
  for (const [normalizedCandidate, rawCandidate] of candidates.entries()) {
    if (!normalizedCandidate || normalizedCandidate === normalizedQuery) continue;
    if (Math.abs(normalizedCandidate.length - normalizedQuery.length) > 4) continue;
    const score = similarity(normalizedQuery, normalizedCandidate);
    if (score > bestScore) {
      bestScore = score;
      bestValue = rawCandidate;
    } else if (score === bestScore && bestValue && rawCandidate.localeCompare(bestValue) < 0) {
      bestValue = rawCandidate;
    }
  }
  if (!bestValue || bestScore < 0.74) {
    return null;
  }
  return bestValue;
}

// src/constants/reproductiveScope.ts
var REPRODUCTIVE_GOAL_IDS = /* @__PURE__ */ new Set([
  "hormones",
  "fertility",
  "sexual-health",
  "sexual-function",
  "libido",
  "reproductive"
]);
var PREGNANCY_TEXT_PATTERN = /pregnan|prenatal|gestation|trimester/;
var BREASTFEEDING_TEXT_PATTERN = /breastfeed|lactation|nursing/;
var TTC_TEXT_PATTERN = /trying to conceive|ttc|conceive|ovulation|preconception/;

// src/utils/analyzer.ts
var INTIMACY_GOALS = /* @__PURE__ */ new Set([
  "libido",
  "fertility",
  "hormones",
  "sexual-health",
  "sexual-function",
  "erectile-function",
  "semen-volume",
  "sperm-quality",
  "sperm-motility",
  "sperm-count",
  "male-reproductive",
  "female-reproductive",
  "reproductive",
  "women-health",
  "hormonal-balance",
  "testosterone",
  "sex-drive",
  "intimacy",
  "sexual"
]);
var STACK_GOAL_ALIASES = {
  "sexual-health": ["libido", "fertility", "hormones"],
  "sexual-function": ["libido", "hormones"],
  "erectile-function": ["libido", "hormones"],
  "semen-volume": ["fertility", "hormones"],
  "sperm-quality": ["fertility", "hormones"],
  "sperm-motility": ["fertility", "hormones"],
  "sperm-count": ["fertility", "hormones"],
  "male-reproductive": ["fertility", "libido"],
  "female-reproductive": ["fertility", "hormones"],
  "intimacy": ["libido", "hormones"],
  "sexual": ["libido", "hormones"],
  "sex-drive": ["libido", "hormones"]
};
function getRecommendedStacks(profile, goals = []) {
  const normalizedGoals = normalizeGoals(goals);
  const rawGoals = goals.map((goal) => goal.toLowerCase());
  const targetGender = profile?.sex === "male" ? "men" : profile?.sex === "female" ? "women" : "all";
  const availableStacks = premadeStacks.filter((stack) => stack.targetGender === "all" || stack.targetGender === targetGender);
  const hasRawIntimacyGoal = rawGoals.some((goal) => INTIMACY_GOALS.has(goal));
  if (normalizedGoals.length === 0 && !hasRawIntimacyGoal) {
    return availableStacks;
  }
  const goalMatches = normalizedGoals.filter((goal) => INTIMACY_GOALS.has(goal));
  if (goalMatches.length === 0 && hasRawIntimacyGoal) {
    goalMatches.push("hormones");
  }
  if (goalMatches.length === 0) {
    return availableStacks;
  }
  const expandedGoalMatches = new Set(goalMatches);
  goalMatches.forEach((goal) => {
    STACK_GOAL_ALIASES[goal]?.forEach((alias) => expandedGoalMatches.add(alias));
  });
  return availableStacks.filter(
    (stack) => Array.from(expandedGoalMatches).some(
      (goal) => stack.primaryGoal === goal || goal === "hormones" && stack.primaryGoal === "fertility"
    )
  );
}
function tokenize2(text) {
  return text.toLowerCase().replace(/[^\w\s'-]/g, " ").split(/\s+/).filter((word) => word.length > 0);
}
var STEM_SUFFIXES = ["ing", "ers", "er", "ed", "es", "s"];
function stemWord(word) {
  for (const suffix of STEM_SUFFIXES) {
    if (word.length > suffix.length + 2 && word.endsWith(suffix)) {
      return word.slice(0, -suffix.length);
    }
  }
  return word;
}
function isTokenNegated(tokens, tokenIndex) {
  const startIndex = Math.max(0, tokenIndex - NEGATION_WINDOW);
  for (let i = startIndex; i < tokenIndex; i++) {
    if (NEGATION_WORDS.includes(tokens[i])) {
      return true;
    }
  }
  return false;
}
function parseInput(text) {
  const tokens = tokenize2(text);
  return tokens.map((word, index) => ({
    word,
    index,
    isNegated: isTokenNegated(tokens, index),
    root: stemWord(word)
  }));
}
var MIN_PARTIAL_MATCH_LENGTH = 4;
var STOP_WORDS = /* @__PURE__ */ new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "up",
  "about",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "between",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "just",
  "can",
  "will",
  "should",
  "would",
  "could",
  "may",
  "might",
  "must",
  "shall",
  "need",
  "want",
  "like",
  "get",
  "got",
  "make",
  "made",
  "take",
  "took",
  "come",
  "came",
  "go",
  "went",
  "see",
  "saw",
  "know",
  "knew",
  "think",
  "thought",
  "feel",
  "felt",
  "find",
  "found",
  "give",
  "gave",
  "tell",
  "told",
  "work",
  "working",
  "day",
  "time",
  "way",
  "year",
  "good",
  "bad",
  "new",
  "old",
  "high",
  "low",
  "long",
  "short",
  "big",
  "small",
  "great",
  "little",
  "right",
  "left",
  "first",
  "last",
  "next",
  "early",
  "late",
  "hard",
  "easy",
  "best",
  "worst",
  "have",
  "has",
  "had",
  "having",
  "do",
  "does",
  "did",
  "doing",
  "be",
  "been",
  "being",
  "am",
  "is",
  "are",
  "was",
  "were",
  "i",
  "me",
  "my",
  "we",
  "us",
  "our",
  "you",
  "your",
  "he",
  "him",
  "his",
  "she",
  "her",
  "it",
  "its",
  "they",
  "them",
  "their",
  "what",
  "which",
  "who",
  "whom",
  "this",
  "that",
  "these",
  "those",
  "while",
  "during"
]);
function levenshteinDistance2(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}
function fuzzyMatch(input, target, threshold = 0.7) {
  if (!input || !target) return false;
  const normalizedInput = input.toLowerCase();
  const normalizedTarget = target.toLowerCase();
  if (normalizedInput === normalizedTarget) return true;
  if (normalizedTarget.includes(normalizedInput) || normalizedInput.includes(normalizedTarget)) return true;
  const distance = levenshteinDistance2(normalizedInput, normalizedTarget);
  const similarity2 = 1 - distance / Math.max(normalizedTarget.length, 1);
  return similarity2 >= threshold;
}
function matchKeyword(tokens, keyword) {
  const keywordTokens = tokenize2(keyword);
  const keywordRoots = keywordTokens.map(stemWord);
  for (let i = 0; i <= tokens.length - keywordTokens.length; i++) {
    let match = true;
    let anyNegated = false;
    for (let j = 0; j < keywordTokens.length; j++) {
      const token = tokens[i + j];
      const keywordToken = keywordTokens[j];
      const keywordRoot = keywordRoots[j];
      const tokenLength = token.word.length;
      const baseLength = Math.max(keywordToken.length, keywordRoot.length);
      const isExactMatch = token.word === keywordToken || token.root === keywordToken || token.word === keywordRoot || token.root === keywordRoot;
      const isInflectedMatch = keywordToken.length >= MIN_PARTIAL_MATCH_LENGTH && (token.word.startsWith(keywordToken) || token.word.startsWith(keywordRoot)) && tokenLength >= baseLength && tokenLength - baseLength <= 2;
      if (!isExactMatch && !isInflectedMatch) {
        match = false;
        break;
      }
      if (token.isNegated) {
        anyNegated = true;
      }
    }
    if (match && !anyNegated) {
      return true;
    }
  }
  return false;
}
function matchPartialKeyword(tokens, keyword) {
  const keywordLower = keyword.toLowerCase();
  const keywordRoot = stemWord(keywordLower);
  if (keywordLower.length < 3) {
    return false;
  }
  for (const token of tokens) {
    if (STOP_WORDS.has(token.word)) {
      continue;
    }
    if (token.word.length < MIN_PARTIAL_MATCH_LENGTH) {
      continue;
    }
    if (token.isNegated) {
      continue;
    }
    if (token.word.includes(keywordLower) || token.word.includes(keywordRoot)) {
      return true;
    }
    if (token.word.length >= 5 && (keywordLower.includes(token.word) || keywordRoot.includes(token.word))) {
      const tokenRatio = token.word.length / keywordLower.length;
      if (tokenRatio >= 0.5) {
        return true;
      }
    }
  }
  return false;
}
function findSupplementByNameOrAlias(supplements2, name) {
  const normalizedName = name.toLowerCase();
  const alias = normalizeSupplementName(normalizedName).toLowerCase();
  return supplements2.find((s) => {
    const candidates = getSupplementMatchCandidates(s);
    return candidates.some(
      (candidate) => candidate === normalizedName || candidate === alias || candidate.includes(normalizedName) || candidate.includes(alias) || fuzzyMatch(normalizedName, candidate, 0.78) || fuzzyMatch(alias, candidate, 0.78)
    );
  });
}
function getSupplementMatchCandidates(supplement) {
  return getSupplementSearchCandidates(supplement);
}
function isNegatedSupplementMatch(inputTokens, candidates) {
  const targetTokens = /* @__PURE__ */ new Set([
    ...candidates.flatMap(tokenize2)
  ]);
  for (const token of inputTokens) {
    if (!token.isNegated) continue;
    if (targetTokens.has(token.word) || targetTokens.has(token.root)) {
      return true;
    }
  }
  return false;
}
function findDirectSupplementMatches(input, supplements2) {
  const normalizedInput = input.toLowerCase().trim();
  if (!normalizedInput || normalizedInput.length < 3) {
    return { supplements: [], inferredGoals: [], inferredSystems: [] };
  }
  const inputTokens = parseInput(input);
  const queryCandidates = /* @__PURE__ */ new Set([
    normalizedInput,
    normalizeSupplementName(normalizedInput).toLowerCase()
  ]);
  const matches = supplements2.filter((supplement) => {
    const supplementCandidates = getSupplementMatchCandidates(supplement);
    if (isNegatedSupplementMatch(inputTokens, supplementCandidates)) {
      return false;
    }
    return Array.from(queryCandidates).some(
      (query) => supplementCandidates.some((candidate) => fuzzyMatch(query, candidate, 0.78))
    );
  });
  const canonicalMatches = dedupeSupplementsByCanonical(matches);
  const inferredGoals = /* @__PURE__ */ new Set();
  const inferredSystems = /* @__PURE__ */ new Set();
  for (const match of canonicalMatches) {
    normalizeGoals(match.goals).forEach((goal) => inferredGoals.add(goal));
    normalizeSystems(match.systems).forEach((system) => inferredSystems.add(system));
  }
  return {
    supplements: canonicalMatches,
    inferredGoals: Array.from(inferredGoals),
    inferredSystems: Array.from(inferredSystems)
  };
}
function findSemanticMatches(supplements2, tokens) {
  const matchedGoals = /* @__PURE__ */ new Set();
  const matchedSystems = /* @__PURE__ */ new Set();
  const matchedSupplements = [];
  for (const association of Object.values(SEMANTIC_ASSOCIATIONS)) {
    const hasMatch = association.synonyms.some((synonym) => matchKeyword(tokens, synonym));
    if (!hasMatch) continue;
    association.goals.forEach((goal) => matchedGoals.add(goal));
    association.systems.forEach((system) => matchedSystems.add(system));
    for (const supplementName of association.supplements) {
      const match = findSupplementByNameOrAlias(supplements2, supplementName);
      if (match && !matchedSupplements.find((s) => s.id === match.id)) {
        matchedSupplements.push(match);
      }
    }
  }
  return {
    supplements: dedupeSupplementsByCanonical(matchedSupplements),
    inferredGoals: normalizeGoals(Array.from(matchedGoals)),
    inferredSystems: normalizeSystems(Array.from(matchedSystems))
  };
}
function findIntentSimilarityMatches(input) {
  const ranked = rankByCosineSimilarity(input, semanticIntentDataset, 2);
  if (ranked.length === 0 || ranked[0].score < 0.18) {
    return { inferredGoals: [], inferredSystems: [] };
  }
  const inferredGoals = /* @__PURE__ */ new Set();
  const inferredSystems = /* @__PURE__ */ new Set();
  for (const match of ranked) {
    if (match.score < 0.14) continue;
    match.item.goals.forEach((goal) => inferredGoals.add(goal));
    match.item.systems.forEach((system) => inferredSystems.add(system));
  }
  return {
    inferredGoals: normalizeGoals(Array.from(inferredGoals)),
    inferredSystems: normalizeSystems(Array.from(inferredSystems))
  };
}
var EXACT_MATCH_WEIGHT = 3;
var PARTIAL_MATCH_WEIGHT = 1;
var SEMANTIC_MATCH_WEIGHT = 2;
var EVIDENCE_MULTIPLIERS = {
  strong: 1.3,
  moderate: 1.1,
  limited: 0.9
};
function getGoalEvidenceLevel(supplement, goalId) {
  return supplement.goalEvidence?.[goalId] || supplement.evidence;
}
var MIN_GOAL_SCORE = 2;
function identifyGoals(tokens) {
  const goals = [];
  const tokenSet = new Set(tokens.map((token) => token.root));
  for (const category of GOAL_CATEGORIES) {
    const matchedKeywords = [];
    let score = 0;
    for (const keyword of category.keywords) {
      const exactMatch = matchKeyword(tokens, keyword);
      const partialMatch = !exactMatch && matchPartialKeyword(tokens, keyword);
      const keywordTokens = tokenize2(keyword).map(stemWord);
      const hasSemanticOverlap = keywordTokens.some((token) => tokenSet.has(token));
      if (exactMatch) {
        matchedKeywords.push(keyword);
        score += EXACT_MATCH_WEIGHT;
      } else if (partialMatch) {
        matchedKeywords.push(keyword);
        score += PARTIAL_MATCH_WEIGHT;
      } else if (hasSemanticOverlap) {
        score += SEMANTIC_MATCH_WEIGHT;
      }
    }
    if (matchedKeywords.length > 0 && score >= MIN_GOAL_SCORE) {
      goals.push({
        id: category.id,
        label: category.label,
        score,
        matchedKeywords
      });
    }
  }
  return goals.sort((a, b) => b.score - a.score).slice(0, 4);
}
var MIN_SYSTEM_SCORE = 2;
function identifySystems(tokens) {
  const systems = [];
  const tokenSet = new Set(tokens.map((token) => token.root));
  for (const system of SYSTEM_DEFINITIONS) {
    let score = 0;
    for (const keyword of system.keywords) {
      const exactMatch = matchKeyword(tokens, keyword);
      const partialMatch = !exactMatch && matchPartialKeyword(tokens, keyword);
      const keywordTokens = tokenize2(keyword).map(stemWord);
      const hasSemanticOverlap = keywordTokens.some((token) => tokenSet.has(token));
      if (exactMatch) {
        score += EXACT_MATCH_WEIGHT;
      } else if (partialMatch) {
        score += PARTIAL_MATCH_WEIGHT;
      } else if (hasSemanticOverlap) {
        score += SEMANTIC_MATCH_WEIGHT;
      }
    }
    if (score >= MIN_SYSTEM_SCORE) {
      systems.push({
        id: system.id,
        label: system.label,
        score
      });
    }
  }
  return systems.sort((a, b) => b.score - a.score).slice(0, 3);
}
function buildMatchedGoals(goalIds) {
  return goalIds.map((goalId) => {
    const category = GOAL_CATEGORIES.find((g) => g.id === goalId);
    return {
      id: goalId,
      label: category?.label ?? goalId,
      score: 2,
      matchedKeywords: category?.keywords ?? [goalId]
    };
  });
}
function buildMatchedSystems(systemIds) {
  return systemIds.map((systemId) => ({
    id: systemId,
    label: SYSTEM_DEFINITIONS.find((s) => s.id === systemId)?.label ?? systemId,
    score: 2
  }));
}
function findRelatedSupplements(seeds, supplements2) {
  const seedGoals = new Set(seeds.flatMap((s) => normalizeGoals(s.goals)));
  if (seedGoals.size === 0) return [];
  return supplements2.filter((s) => !seeds.some((seed) => seed.id === s.id)).map((s) => {
    const sharedGoals = normalizeGoals(s.goals).filter((goal) => seedGoals.has(goal)).length;
    return { supplement: s, sharedGoals };
  }).filter((item) => item.sharedGoals > 0).sort((a, b) => b.sharedGoals - a.sharedGoals).slice(0, 6).map((item) => item.supplement);
}
function scoreSupplementForGoals(supplement, matchedGoals, matchedSystems) {
  let score = 0;
  const normalizedGoals = normalizeGoals(supplement.goals);
  const normalizedSystems = normalizeSystems(supplement.systems);
  const knowledge = getSupplementKnowledgeById(supplement.id);
  const normalizedKnowledgeUseCases = normalizeGoals((knowledge?.typicalUseCases || []).map((useCase) => useCase.toLowerCase()));
  for (const goal of matchedGoals) {
    if (normalizedGoals.includes(goal.id)) {
      const evidenceLevel = getGoalEvidenceLevel(supplement, goal.id);
      const evidenceMultiplier = EVIDENCE_MULTIPLIERS[evidenceLevel] || 1;
      score += goal.score * 10 * evidenceMultiplier;
    }
    if (normalizedKnowledgeUseCases.includes(goal.id)) {
      score += goal.score * 6;
    }
    for (const keyword of goal.matchedKeywords) {
      if (supplement.benefits?.some((b) => b.toLowerCase().includes(keyword))) {
        score += 2;
      }
      if (supplement.description?.toLowerCase().includes(keyword)) {
        score += 1;
      }
      if (knowledge?.typicalUseCases.some((useCase) => useCase.toLowerCase().includes(keyword))) {
        score += 1.5;
      }
    }
  }
  for (const system of matchedSystems) {
    if (normalizedSystems.includes(system.id)) {
      score += system.score * 5;
    }
  }
  const overallMultiplier = EVIDENCE_MULTIPLIERS[supplement.evidence] || 1;
  score *= overallMultiplier;
  return score;
}
function determinePriority(score, evidence) {
  if (score >= 30 && evidence === "strong") {
    return "essential";
  } else if (score >= 15 || evidence === "strong") {
    return "beneficial";
  }
  return "optional";
}
function generateReason(supplement, matchedGoals, matchedSystems) {
  const reasons = [];
  const normalizedGoals = normalizeGoals(supplement.goals);
  const normalizedSystems = normalizeSystems(supplement.systems);
  const addressedGoals = matchedGoals.filter(
    (g) => normalizedGoals.includes(g.id) || supplement.benefits?.some(
      (b) => g.matchedKeywords.some((k) => b.toLowerCase().includes(k))
    )
  );
  if (addressedGoals.length > 0) {
    const goalNames = addressedGoals.map((g) => g.label).slice(0, 2);
    reasons.push(`Supports ${goalNames.join(" and ")}`);
  }
  const addressedSystems = matchedSystems.filter(
    (s) => normalizedSystems.includes(s.id)
  );
  if (addressedSystems.length > 0) {
    reasons.push(`Works on ${addressedSystems[0].label.toLowerCase()}`);
  }
  if (supplement.evidence === "strong") {
    reasons.push("Strong clinical evidence");
  }
  if (supplement.benefits && supplement.benefits.length > 0) {
    reasons.push(supplement.benefits[0]);
  }
  return reasons.slice(0, 2).join(". ") + ".";
}
var SEVERITY_KEYWORDS = {
  mild: ["mild", "light", "occasional"],
  moderate: ["moderate", "medium"],
  severe: ["severe", "intense", "extreme", "debilitating"]
};
var DURATION_KEYWORDS = {
  acute: ["recent", "acute", "sudden", "short-term"],
  chronic: ["chronic", "long-term", "months", "years", "ongoing", "persistent"]
};
function extractQueryContext(input, profile) {
  const text = input.toLowerCase();
  const severity = Object.keys(SEVERITY_KEYWORDS).find(
    (level) => SEVERITY_KEYWORDS[level].some((term) => text.includes(term))
  );
  const duration = Object.keys(DURATION_KEYWORDS).find(
    (level) => DURATION_KEYWORDS[level].some((term) => text.includes(term))
  );
  const avoidStimulating = /no stimulants?|avoid stimulants?|not stimulating|caffeine sensitive|sensitive to caffeine/.test(text) || profile?.caffeineIntake === "high";
  const avoidSedating = /no sedat(ing|ive)|avoid sedat(ing|ive)|not sleepy|no drowsy/.test(text);
  const avoidHerbs = /no herbs?|avoid herbs?|no botanicals?|avoid botanicals?/.test(text);
  const avoidHormonal = /non[-\s]?hormonal|avoid hormones|no hormonal/.test(text);
  return { severity, duration, avoidStimulating, avoidSedating, avoidHerbs, avoidHormonal };
}
function isStimulatingSupplement(supplement) {
  const name = supplement.name.toLowerCase();
  const stimulantTerms = [
    "caffeine",
    "guarana",
    "green tea",
    "white tea",
    "black tea",
    "oolong",
    "yellow tea",
    "pu-erh",
    "matcha",
    "sencha",
    "earl grey",
    "english breakfast",
    "yerba",
    "ginseng",
    "rhodiola",
    "cordyceps"
  ];
  if (stimulantTerms.some((term) => name.includes(term))) return true;
  const cautionText = [...supplement.cautions || [], ...supplement.drugInteractions || []].join(" ").toLowerCase();
  if (cautionText.includes("caffeine")) return true;
  return supplement.benefits.some((benefit) => benefit.toLowerCase().includes("energy") || benefit.toLowerCase().includes("alert"));
}
function isSedatingSupplement(supplement) {
  const name = supplement.name.toLowerCase();
  const sedatingTerms = ["melatonin", "valerian", "glycine", "gaba", "passionflower"];
  if (sedatingTerms.some((term) => name.includes(term))) return true;
  return supplement.benefits.some((benefit) => benefit.toLowerCase().includes("sleep") || benefit.toLowerCase().includes("calm"));
}
function applyContextAdjustments(supplements2, context) {
  return supplements2.map(({ supplement, score }) => {
    let adjustedScore = score;
    if (context.avoidStimulating && isStimulatingSupplement(supplement)) {
      adjustedScore *= 0.6;
    }
    if (context.avoidSedating && isSedatingSupplement(supplement)) {
      adjustedScore *= 0.6;
    }
    if (context.avoidHerbs && ["herb", "ayurvedic", "mushroom"].includes(supplement.type)) {
      adjustedScore *= 0.5;
    }
    if (context.avoidHormonal && normalizeGoals(supplement.goals).includes("hormones")) {
      adjustedScore *= 0.6;
    }
    if (context.duration === "chronic") {
      if (supplement.evidence === "limited") {
        adjustedScore *= 0.85;
      }
    }
    if (context.severity === "severe") {
      if (supplement.evidence === "strong") {
        adjustedScore *= 1.1;
      } else if (supplement.evidence === "limited") {
        adjustedScore *= 0.8;
      }
    }
    return { supplement, score: adjustedScore };
  });
}
var MEDICATION_CLASS_MATCHES = {
  "blood thinner": ["warfarin", "coumadin", "heparin", "apixaban", "rivaroxaban", "dabigatran", "edoxaban"],
  anticoagulant: ["anticoagulant", "blood thinner"],
  antiplatelet: ["clopidogrel", "prasugrel", "ticagrelor", "aspirin", "antiplatelet"],
  ssri: ["sertraline", "fluoxetine", "citalopram", "escitalopram", "paroxetine", "fluvoxamine"],
  snri: ["venlafaxine", "desvenlafaxine", "duloxetine", "levomilnacipran"],
  maoi: ["maoi", "phenelzine", "tranylcypromine", "isocarboxazid", "selegiline"],
  triptan: ["sumatriptan", "rizatriptan", "zolmitriptan", "eletriptan", "triptan"],
  lithium: ["lithium"],
  linezolid: ["linezolid"],
  antidepressant: ["antidepressant", "ssri", "snri", "maoi", "bupropion"],
  sedative: ["benzodiazepine", "diazepam", "lorazepam", "clonazepam", "zolpidem", "zopiclone"],
  "thyroid medication": ["levothyroxine", "liothyronine", "thyroid medication", "thyroxine", "synthroid"],
  "diabetes medication": ["metformin", "insulin", "glipizide", "glyburide", "semaglutide"],
  metformin: ["metformin"],
  "parkinson's medication": ["levodopa", "carbidopa", "pramipexole", "ropinirole", "parkinson"]
};
var CONDITION_CLASS_MATCHES = {
  kidney: ["kidney", "renal", "ckd", "dialysis"],
  liver: ["liver", "hepatic", "cirrhosis", "hepatitis"],
  thyroid: ["thyroid", "hypothyroid", "hyperthyroid", "hashimoto", "graves"],
  bipolar: ["bipolar", "mania", "manic"],
  surgery: ["surgery", "operation", "pre-op", "pre op", "post-op", "post op"],
  "bleeding-disorder": ["bleeding disorder", "hemophilia"],
  autoimmune: ["autoimmune", "lupus", "rheumatoid", "multiple sclerosis"]
};
var HIGH_RISK_MEDICATION_CLASSES = /* @__PURE__ */ new Set([
  "blood thinner",
  "anticoagulant",
  "antiplatelet",
  "maoi",
  "lithium",
  "linezolid",
  "parkinson's medication"
]);
var SEROTONERGIC_MEDICATION_CLASSES = /* @__PURE__ */ new Set([
  "ssri",
  "snri",
  "maoi",
  "triptan",
  "lithium",
  "linezolid",
  "antidepressant"
]);
var BOTANICAL_TYPES = /* @__PURE__ */ new Set(["herb", "ayurvedic", "mushroom"]);
var PRENATAL_ESSENTIAL_SUPPLEMENT_IDS = /* @__PURE__ */ new Set(["folate", "iodine", "iron", "choline", "omega-3", "vitamin-d3", "vitamin-b12"]);
var SEROTONERGIC_SUPPLEMENT_IDS = /* @__PURE__ */ new Set(["5-htp", "same", "st-johns-wort", "tryptophan"]);
var THYROID_SPACING_SUPPLEMENT_IDS = /* @__PURE__ */ new Set(["iron", "calcium", "magnesium"]);
var KIDNEY_HIGH_RISK_SUPPLEMENT_IDS = /* @__PURE__ */ new Set(["potassium", "magnesium", "calcium", "creatine", "iron"]);
var LIVER_HIGH_RISK_SUPPLEMENT_IDS = /* @__PURE__ */ new Set(["kava", "green-tea-matcha", "green-tea-sencha", "black-tea-assam"]);
var BIPOLAR_HIGH_RISK_SUPPLEMENT_IDS = /* @__PURE__ */ new Set(["st-johns-wort", "5-htp", "same", "rhodiola", "caffeine", "mucuna"]);
var BLEEDING_RISK_PATTERN = /bleed|blood thinner|anticoagul|antiplatelet/;
var SEROTONERGIC_PATTERN = /serotonin|ssri|snri|maoi|triptan|lithium|linezolid/;
var THYROID_PATTERN = /thyroid|levothyroxine|liothyronine|thyroxine/;
var CAUTION_LEVEL_ORDER = {
  low: 1,
  moderate: 2,
  high: 3
};
function normalizeSafetyText(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function containsNormalizedPhrase(text, phrase) {
  const normalizedText = normalizeSafetyText(text);
  const normalizedPhrase = normalizeSafetyText(phrase);
  if (!normalizedText || !normalizedPhrase) return false;
  const phrasePattern = escapeRegExp(normalizedPhrase).replace(/\s+/g, "\\s+");
  const regex = new RegExp(`\\b${phrasePattern}\\b`);
  if (regex.test(normalizedText)) return true;
  const textTokens = normalizedText.split(" ").filter(Boolean);
  const phraseTokens = normalizedPhrase.split(" ").filter(Boolean);
  if (textTokens.length === 0 || phraseTokens.length === 0) return false;
  const tokenMatchesPattern = (textToken, patternToken) => {
    if (textToken === patternToken) return true;
    if (patternToken.length >= 4 && (textToken === `${patternToken}s` || textToken === `${patternToken}es`)) {
      return true;
    }
    return patternToken.length >= 5 && textToken.startsWith(patternToken);
  };
  if (phraseTokens.length === 1) {
    return textTokens.some((token) => tokenMatchesPattern(token, phraseTokens[0]));
  }
  for (let i = 0; i <= textTokens.length - phraseTokens.length; i++) {
    let allMatched = true;
    for (let j = 0; j < phraseTokens.length; j++) {
      if (!tokenMatchesPattern(textTokens[i + j], phraseTokens[j])) {
        allMatched = false;
        break;
      }
    }
    if (allMatched) {
      return true;
    }
  }
  return false;
}
function normalizedIncludes(a, b) {
  const normalizedA = normalizeSafetyText(a);
  const normalizedB = normalizeSafetyText(b);
  if (!normalizedA || !normalizedB) return false;
  return containsNormalizedPhrase(normalizedA, normalizedB) || containsNormalizedPhrase(normalizedB, normalizedA);
}
function elevateCautionLevel(current, candidate) {
  if (!current) return candidate;
  return CAUTION_LEVEL_ORDER[candidate] > CAUTION_LEVEL_ORDER[current] ? candidate : current;
}
function collectMatchedClasses(values, classMap) {
  const classes = /* @__PURE__ */ new Set();
  for (const value of values) {
    const normalizedValue = normalizeSafetyText(value);
    for (const [className, patterns] of Object.entries(classMap)) {
      if (patterns.some((pattern) => containsNormalizedPhrase(normalizedValue, pattern))) {
        classes.add(className);
      }
    }
  }
  return classes;
}
function conditionMatchesText(conditions, conditionClasses, text) {
  const normalizedText = normalizeSafetyText(text);
  if (!normalizedText) return false;
  if (conditions.some((condition) => containsNormalizedPhrase(normalizedText, condition) || containsNormalizedPhrase(condition, normalizedText))) {
    return true;
  }
  for (const className of conditionClasses) {
    if ((CONDITION_CLASS_MATCHES[className] || []).some((pattern) => containsNormalizedPhrase(normalizedText, pattern))) {
      return true;
    }
  }
  return false;
}
function getMatchedMedicationClasses(text, medicationClasses) {
  const normalizedText = normalizeSafetyText(text);
  if (!normalizedText) return [];
  return Array.from(medicationClasses).filter(
    (className) => containsNormalizedPhrase(normalizedText, className) || (MEDICATION_CLASS_MATCHES[className] || []).some((pattern) => containsNormalizedPhrase(normalizedText, pattern))
  );
}
function buildSupplementSafetyAssessment(supplement, profile) {
  if (!profile) {
    return { flags: [], scorePenalty: 0, exclude: false };
  }
  const knowledge = getSupplementKnowledgeById(supplement.id);
  const flags = [];
  let cautionLevel;
  let scorePenalty = 0;
  let exclude = false;
  const conditions = (profile.healthConditions || []).map((condition) => normalizeSafetyText(condition)).filter(Boolean);
  const meds = (profile.medications || []).map((med) => normalizeSafetyText(med)).filter(Boolean);
  const conditionClasses = collectMatchedClasses(conditions, CONDITION_CLASS_MATCHES);
  const medicationClasses = collectMatchedClasses(meds, MEDICATION_CLASS_MATCHES);
  const combinedSafetyText = normalizeSafetyText([
    ...supplement.avoidIf || [],
    ...supplement.cautions || [],
    ...supplement.drugInteractions || []
  ].join(" "));
  const knowledgeFlags = new Set(knowledge?.safetyFlags || []);
  const normalizedGoals = normalizeGoals(supplement.goals || []);
  const hasReproductiveUnknown = (profile.pregnancyStatus ?? "unknown") === "unknown" || (profile.breastfeedingStatus ?? "unknown") === "unknown" || (profile.tryingToConceiveStatus ?? "unknown") === "unknown";
  const isBotanical = BOTANICAL_TYPES.has(supplement.type);
  const addressesReproductiveGoals = normalizedGoals.some((goal) => REPRODUCTIVE_GOAL_IDS.has(goal));
  const hasExplicitReproductiveRiskSignal = knowledgeFlags.has("pregnancy") || knowledgeFlags.has("breastfeeding") || PREGNANCY_TEXT_PATTERN.test(combinedSafetyText) || BREASTFEEDING_TEXT_PATTERN.test(combinedSafetyText) || TTC_TEXT_PATTERN.test(combinedSafetyText);
  const hasBleedingRisk = knowledgeFlags.has("bleeding-risk") || BLEEDING_RISK_PATTERN.test(combinedSafetyText);
  const hasSerotonergicSignal = SEROTONERGIC_SUPPLEMENT_IDS.has(supplement.id) || SEROTONERGIC_PATTERN.test(combinedSafetyText);
  const hasThyroidSignal = knowledgeFlags.has("thyroid") || THYROID_PATTERN.test(combinedSafetyText);
  if (hasReproductiveUnknown && (addressesReproductiveGoals || hasExplicitReproductiveRiskSignal)) {
    flags.push("Safety intake incomplete: set pregnancy, breastfeeding, and trying-to-conceive status before using reproductive-risk recommendations.");
    cautionLevel = elevateCautionLevel(cautionLevel, "high");
    scorePenalty += 1;
    exclude = true;
  }
  if ((profile.pregnancyStatus ?? "unknown") === "yes") {
    const isPrenatalEssential = PRENATAL_ESSENTIAL_SUPPLEMENT_IDS.has(supplement.id);
    if (!isPrenatalEssential || isBotanical || supplement.type === "performance") {
      flags.push("Pregnancy: this supplement is not in the default prenatal-safe essentials list. Use clinician guidance.");
      cautionLevel = elevateCautionLevel(cautionLevel, "high");
      scorePenalty += 1;
      exclude = true;
    } else {
      flags.push("Pregnancy: keep dosing clinician-guided and avoid combining overlapping products.");
      cautionLevel = elevateCautionLevel(cautionLevel, "moderate");
      scorePenalty += 0.2;
    }
  }
  if ((profile.breastfeedingStatus ?? "unknown") === "yes" && isBotanical && supplement.evidence !== "strong") {
    flags.push("Breastfeeding: limited-evidence botanicals are suppressed unless reviewed by a clinician.");
    cautionLevel = elevateCautionLevel(cautionLevel, "high");
    scorePenalty += 0.8;
    exclude = true;
  }
  for (const avoid of supplement.avoidIf || []) {
    const avoidText = normalizeSafetyText(avoid);
    const mentionsPregnancy = PREGNANCY_TEXT_PATTERN.test(avoidText);
    const mentionsBreastfeeding = BREASTFEEDING_TEXT_PATTERN.test(avoidText);
    const mentionsTtc = TTC_TEXT_PATTERN.test(avoidText);
    if (mentionsPregnancy) {
      if ((profile.pregnancyStatus ?? "unknown") === "yes") {
        flags.push(`Avoid during pregnancy: ${avoid}`);
        cautionLevel = elevateCautionLevel(cautionLevel, "high");
        scorePenalty += 1;
        exclude = true;
      } else if ((profile.pregnancyStatus ?? "unknown") === "unknown") {
        flags.push(`Pregnancy status required before considering this supplement: ${avoid}`);
        cautionLevel = elevateCautionLevel(cautionLevel, "high");
        scorePenalty += 1;
        exclude = true;
      }
    }
    if (mentionsBreastfeeding) {
      if ((profile.breastfeedingStatus ?? "unknown") === "yes") {
        flags.push(`Avoid while breastfeeding: ${avoid}`);
        cautionLevel = elevateCautionLevel(cautionLevel, "high");
        scorePenalty += 1;
        exclude = true;
      } else if ((profile.breastfeedingStatus ?? "unknown") === "unknown") {
        flags.push(`Breastfeeding status required before considering this supplement: ${avoid}`);
        cautionLevel = elevateCautionLevel(cautionLevel, "high");
        scorePenalty += 1;
        exclude = true;
      }
    }
    if (mentionsTtc && (profile.tryingToConceiveStatus ?? "unknown") === "yes") {
      flags.push(`Avoid while trying to conceive: ${avoid}`);
      cautionLevel = elevateCautionLevel(cautionLevel, "high");
      scorePenalty += 1;
      exclude = true;
    } else if (mentionsTtc && (profile.tryingToConceiveStatus ?? "unknown") === "unknown") {
      flags.push(`Trying-to-conceive status required before considering this supplement: ${avoid}`);
      cautionLevel = elevateCautionLevel(cautionLevel, "high");
      scorePenalty += 1;
      exclude = true;
    }
    if (conditionMatchesText(conditions, conditionClasses, avoid)) {
      flags.push(`Avoid if ${avoid}`);
      cautionLevel = elevateCautionLevel(cautionLevel, "high");
      scorePenalty += 1;
      exclude = true;
    }
  }
  for (const interaction of supplement.drugInteractions || []) {
    if (meds.some((med) => normalizedIncludes(interaction, med))) {
      flags.push(`Drug interaction: ${interaction}`);
      cautionLevel = elevateCautionLevel(cautionLevel, "high");
      scorePenalty += 0.6;
    }
    const matchedClasses = getMatchedMedicationClasses(interaction, medicationClasses);
    if (matchedClasses.length > 0) {
      for (const matchedClass of matchedClasses) {
        flags.push(`Drug interaction (${matchedClass}): ${interaction}`);
        cautionLevel = elevateCautionLevel(cautionLevel, HIGH_RISK_MEDICATION_CLASSES.has(matchedClass) ? "high" : "moderate");
        scorePenalty += HIGH_RISK_MEDICATION_CLASSES.has(matchedClass) ? 0.7 : 0.35;
      }
    }
  }
  for (const caution of supplement.cautions || []) {
    if (conditionMatchesText(conditions, conditionClasses, caution)) {
      flags.push(`Caution: ${caution}`);
      cautionLevel = elevateCautionLevel(cautionLevel, "moderate");
      scorePenalty += 0.25;
    }
  }
  if (Array.from(medicationClasses).some((className) => ["blood thinner", "anticoagulant", "antiplatelet"].includes(className)) && hasBleedingRisk) {
    flags.push("High-risk interaction: bleeding risk with anticoagulant/antiplatelet medication.");
    cautionLevel = elevateCautionLevel(cautionLevel, "high");
    scorePenalty += 1;
    exclude = true;
  }
  if (Array.from(medicationClasses).some((className) => SEROTONERGIC_MEDICATION_CLASSES.has(className)) && hasSerotonergicSignal) {
    flags.push("High-risk interaction: serotonergic medication overlap (risk of serotonin toxicity).");
    cautionLevel = elevateCautionLevel(cautionLevel, "high");
    scorePenalty += 1;
    exclude = true;
  }
  if (medicationClasses.has("thyroid medication")) {
    if (THYROID_SPACING_SUPPLEMENT_IDS.has(supplement.id)) {
      flags.push("Thyroid medication: separate this supplement by at least 4 hours.");
      cautionLevel = elevateCautionLevel(cautionLevel, "high");
      scorePenalty += 0.45;
    }
    if (hasThyroidSignal) {
      flags.push("Thyroid-active supplement: use clinician supervision with thyroid medication.");
      cautionLevel = elevateCautionLevel(cautionLevel, "high");
      scorePenalty += 0.65;
    }
  }
  if (conditionClasses.has("kidney") && (KIDNEY_HIGH_RISK_SUPPLEMENT_IDS.has(supplement.id) || knowledgeFlags.has("kidney"))) {
    flags.push("Kidney condition: this supplement requires clinician review before use.");
    cautionLevel = elevateCautionLevel(cautionLevel, "high");
    scorePenalty += 1;
    exclude = true;
  }
  if (conditionClasses.has("liver") && (LIVER_HIGH_RISK_SUPPLEMENT_IDS.has(supplement.id) || knowledgeFlags.has("liver"))) {
    flags.push("Liver condition: avoid hepatotoxic-risk supplements without medical sign-off.");
    cautionLevel = elevateCautionLevel(cautionLevel, "high");
    scorePenalty += 1;
    exclude = true;
  }
  if (conditionClasses.has("bipolar") && (BIPOLAR_HIGH_RISK_SUPPLEMENT_IDS.has(supplement.id) || hasSerotonergicSignal || isStimulatingSupplement(supplement))) {
    flags.push("Bipolar/mania history: avoid stimulating or serotonergic supplements unless clinician-guided.");
    cautionLevel = elevateCautionLevel(cautionLevel, "high");
    scorePenalty += 1;
    exclude = true;
  }
  if (conditionClasses.has("surgery") && (hasBleedingRisk || isSedatingSupplement(supplement))) {
    flags.push("Planned surgery: hold bleeding-risk or sedating supplements unless surgeon approves.");
    cautionLevel = elevateCautionLevel(cautionLevel, "high");
    scorePenalty += 0.8;
    exclude = true;
  }
  return {
    flags: Array.from(new Set(flags)),
    cautionLevel,
    scorePenalty: Math.min(1, scorePenalty),
    exclude
  };
}
function applySafetyScreening(supplements2, profile) {
  return supplements2.map(({ supplement, score }) => {
    const assessment = buildSupplementSafetyAssessment(supplement, profile);
    let adjustedScore = score;
    if (assessment.scorePenalty > 0) {
      adjustedScore *= Math.max(0, 1 - assessment.scorePenalty);
    }
    if (assessment.exclude) {
      adjustedScore = 0;
    }
    return {
      supplement,
      score: adjustedScore,
      safetyFlags: assessment.flags,
      cautionLevel: assessment.cautionLevel
    };
  });
}
function applyTrackingAdjustments(supplements2, trackingData) {
  if (!trackingData || trackingData.logs.length === 0) {
    return supplements2;
  }
  const logs = trackingData.logs;
  const overallAverage = logs.reduce((sum, log) => {
    return sum + (log.sleepQuality + log.energyLevel + log.mood + log.focus + log.recovery) / 5;
  }, 0) / logs.length;
  const supplementScores = /* @__PURE__ */ new Map();
  for (const log of logs) {
    const logScore = (log.sleepQuality + log.energyLevel + log.mood + log.focus + log.recovery) / 5;
    for (const supplementName of log.supplementsTaken) {
      const normalized = normalizeSupplementName(supplementName).toLowerCase();
      if (!supplementScores.has(normalized)) {
        supplementScores.set(normalized, []);
      }
      supplementScores.get(normalized)?.push(logScore);
    }
  }
  return supplements2.map((item) => {
    const normalized = normalizeSupplementName(item.supplement.name).toLowerCase();
    const scores = supplementScores.get(normalized);
    if (!scores || scores.length < 2) {
      return item;
    }
    const avg = scores.reduce((sum, value) => sum + value, 0) / scores.length;
    const delta = avg - overallAverage;
    let adjustedScore = item.score;
    if (delta >= 0.3) {
      adjustedScore *= 1.15;
    } else if (delta <= -0.3) {
      adjustedScore *= 0.85;
    }
    return { ...item, score: adjustedScore };
  });
}
function dedupeScoredSupplementsByCanonical(supplements2) {
  const cautionOrder = {
    high: 3,
    moderate: 2,
    low: 1
  };
  const deduped = /* @__PURE__ */ new Map();
  for (const candidate of supplements2) {
    const key = getCanonicalSupplementKey(candidate.supplement);
    const existing = deduped.get(key);
    if (!existing) {
      deduped.set(key, {
        ...candidate,
        safetyFlags: Array.from(new Set(candidate.safetyFlags || []))
      });
      continue;
    }
    const mergedFlags = Array.from(/* @__PURE__ */ new Set([...existing.safetyFlags || [], ...candidate.safetyFlags || []]));
    const existingCaution = existing.cautionLevel;
    const candidateCaution = candidate.cautionLevel;
    const mergedCaution = (() => {
      if (!existingCaution) return candidateCaution;
      if (!candidateCaution) return existingCaution;
      return cautionOrder[candidateCaution] > cautionOrder[existingCaution] ? candidateCaution : existingCaution;
    })();
    const shouldPreferCandidate = candidate.score > existing.score || candidate.score === existing.score && choosePreferredCanonicalSupplement(existing.supplement, candidate.supplement).id === candidate.supplement.id;
    if (shouldPreferCandidate) {
      deduped.set(key, {
        ...candidate,
        safetyFlags: mergedFlags,
        cautionLevel: mergedCaution
      });
    } else {
      deduped.set(key, {
        ...existing,
        safetyFlags: mergedFlags,
        cautionLevel: mergedCaution
      });
    }
  }
  return Array.from(deduped.values());
}
function selectDiverseRecommendations(supplements2, matchedGoals, limit = 6) {
  const selected = [];
  const usedIds = /* @__PURE__ */ new Set();
  for (const goal of matchedGoals) {
    const candidate = supplements2.find(
      (item) => !usedIds.has(item.supplement.id) && normalizeGoals(item.supplement.goals).includes(goal.id)
    );
    if (candidate) {
      selected.push(candidate);
      usedIds.add(candidate.supplement.id);
    }
    if (selected.length >= limit) {
      return selected;
    }
  }
  for (const item of supplements2) {
    if (selected.length >= limit) break;
    if (!usedIds.has(item.supplement.id)) {
      selected.push(item);
      usedIds.add(item.supplement.id);
    }
  }
  return selected;
}
var VEGAN_PRIORITY_SUPPLEMENT_IDS = /* @__PURE__ */ new Set(["vitamin-b12", "omega-3", "iron", "zinc", "iodine"]);
var VEGETARIAN_PRIORITY_SUPPLEMENT_IDS = /* @__PURE__ */ new Set(["vitamin-b12", "iron", "zinc"]);
var FISH_DERIVED_PATTERN = /fish|krill|anchovy|sardine|salmon|cod liver/;
function applyProfileAdjustments(supplements2, profile) {
  if (!profile) return supplements2;
  const nutrientPriorityMap = /* @__PURE__ */ new Map();
  for (const target of buildNutrientTargets(profile)) {
    const multiplier = target.priority === "high" ? 1.35 : target.priority === "medium" ? 1.2 : 1;
    for (const supplementId of target.supplementIds) {
      nutrientPriorityMap.set(supplementId, Math.max(nutrientPriorityMap.get(supplementId) || 1, multiplier));
    }
  }
  return supplements2.map(({ supplement, score }) => {
    let adjustedScore = score;
    const normalizedName = normalizeSafetyText(supplement.name);
    const normalizedDescription = normalizeSafetyText(supplement.description || "");
    if (profile.diet === "vegan") {
      if (VEGAN_PRIORITY_SUPPLEMENT_IDS.has(supplement.id) || /\bvitamin b12\b|\bomega 3\b|\biron\b|\bzinc\b|\biodine\b/.test(normalizedName)) {
        adjustedScore *= 1.5;
      }
      if (FISH_DERIVED_PATTERN.test(normalizedName) || FISH_DERIVED_PATTERN.test(normalizedDescription) || supplement.id === "krill-oil") {
        adjustedScore = 0;
      }
    }
    if (profile.diet === "vegetarian") {
      if (VEGETARIAN_PRIORITY_SUPPLEMENT_IDS.has(supplement.id) || /\bvitamin b12\b|\biron\b|\bzinc\b/.test(normalizedName)) {
        adjustedScore *= 1.3;
      }
    }
    if (profile.trainingStyle === "strength") {
      if (["Creatine Monohydrate", "Protein", "Vitamin D3", "Zinc", "Magnesium"].some(
        (n) => supplement.name.includes(n)
      )) {
        adjustedScore *= 1.4;
      }
    }
    if (profile.trainingStyle === "endurance") {
      if (["Iron", "Beetroot", "L-Citrulline", "Electrolytes", "L-Carnitine"].some(
        (n) => supplement.name.includes(n)
      )) {
        adjustedScore *= 1.4;
      }
    }
    if (profile.age === "45-59" || profile.age === "60+") {
      if (["CoQ10", "Vitamin D3", "Omega-3", "Vitamin B12", "Collagen", "Calcium"].some(
        (n) => supplement.name.includes(n)
      )) {
        adjustedScore *= 1.3;
      }
    }
    if (profile.sleepQuality === "poor") {
      if (["Magnesium", "Glycine", "L-Theanine", "Melatonin", "Valerian"].some(
        (n) => supplement.name.includes(n)
      )) {
        adjustedScore *= 1.4;
      }
    }
    if (profile.stressLevel === "high" || profile.stressLevel === "very-high") {
      if (["Ashwagandha", "Rhodiola", "L-Theanine", "Magnesium", "Holy Basil"].some(
        (n) => supplement.name.includes(n)
      )) {
        adjustedScore *= 1.4;
      }
    }
    if (profile.caffeineIntake === "high" && isStimulatingSupplement(supplement)) {
      adjustedScore *= 0.8;
    }
    const nutrientBoost = nutrientPriorityMap.get(supplement.id);
    if (nutrientBoost) {
      adjustedScore *= nutrientBoost;
    }
    if (profile.budgetLevel === "budget" && supplement.formGuidance?.forms?.some((form) => form.cost === "high")) {
      adjustedScore *= 0.85;
    }
    if (profile.formPreference && profile.formPreference !== "any") {
      const hasPreferredForm = supplement.formGuidance?.forms?.some(
        (form) => form.name.toLowerCase().includes(profile.formPreference || "")
      );
      if (hasPreferredForm) {
        adjustedScore *= 1.1;
      }
    }
    return { supplement, score: adjustedScore };
  });
}
function filterCurrentSupplements(supplements2, currentSupplements) {
  if (!currentSupplements || currentSupplements.length === 0) {
    return supplements2;
  }
  const normalizedCurrent = currentSupplements.map((s) => normalizeSupplementName(s).toLowerCase());
  return supplements2.filter(({ supplement }) => {
    const normalizedName = supplement.name.toLowerCase();
    const knowledgeAliases = (getSupplementKnowledgeById(supplement.id)?.aliases || []).map((alias) => alias.toLowerCase());
    const aliases = Object.entries(SUPPLEMENT_ALIASES).filter(([, canonical]) => canonical.toLowerCase() === normalizedName).map(([alias]) => alias);
    return !normalizedCurrent.some(
      (current) => normalizedName.includes(current) || current.includes(normalizedName) || aliases.some((alias) => current.includes(alias)) || knowledgeAliases.some((alias) => current.includes(alias) || alias.includes(current))
    );
  });
}
function analyzeGoal(input, supplements2, profile, trackingData) {
  const tokens = parseInput(input);
  const context = extractQueryContext(input, profile);
  let matchedGoals = identifyGoals(tokens);
  let matchedSystems = identifySystems(tokens);
  let matchType = matchedGoals.length || matchedSystems.length ? "keyword" : "none";
  let directMatchIds = [];
  let relatedMatchIds = [];
  let inferredGoals = [];
  let inferredSystems = [];
  if (matchType === "none") {
    const directMatches = findDirectSupplementMatches(input, supplements2);
    if (directMatches.supplements.length > 0) {
      matchType = "direct";
      directMatchIds = directMatches.supplements.map((s) => s.id);
      inferredGoals = directMatches.inferredGoals;
      inferredSystems = directMatches.inferredSystems;
      matchedGoals = buildMatchedGoals(inferredGoals);
      matchedSystems = buildMatchedSystems(inferredSystems);
      relatedMatchIds = findRelatedSupplements(directMatches.supplements, supplements2).map((s) => s.id);
    }
  }
  if (matchType === "none") {
    const semanticMatches = findSemanticMatches(supplements2, tokens);
    if (semanticMatches.supplements.length > 0 || semanticMatches.inferredGoals.length > 0) {
      matchType = "semantic";
      directMatchIds = semanticMatches.supplements.map((s) => s.id);
      inferredGoals = semanticMatches.inferredGoals;
      inferredSystems = semanticMatches.inferredSystems;
      matchedGoals = buildMatchedGoals(inferredGoals);
      matchedSystems = buildMatchedSystems(inferredSystems);
      relatedMatchIds = findRelatedSupplements(semanticMatches.supplements, supplements2).map((s) => s.id);
    }
  }
  if (matchType === "none") {
    const intentMatches = findIntentSimilarityMatches(input);
    if (intentMatches.inferredGoals.length > 0 || intentMatches.inferredSystems.length > 0) {
      matchType = "semantic";
      inferredGoals = intentMatches.inferredGoals;
      inferredSystems = intentMatches.inferredSystems;
      matchedGoals = buildMatchedGoals(inferredGoals);
      matchedSystems = buildMatchedSystems(inferredSystems);
    }
  }
  const lexicalGoalHint = matchedGoals[0]?.id;
  const lexicalMatches = searchSupplementsWithScores(input, supplements2, {
    gender: profile?.sex,
    goal: lexicalGoalHint
  });
  const lexicalScoreById = new Map(lexicalMatches.map((entry) => [entry.supplement.id, entry.score]));
  let scoredSupplements = supplements2.map((supplement) => {
    let score = scoreSupplementForGoals(supplement, matchedGoals, matchedSystems);
    const lexicalScore = lexicalScoreById.get(supplement.id) || 0;
    if (lexicalScore > 0) {
      const lexicalWeight = matchedGoals.length > 0 || matchedSystems.length > 0 ? 0.16 : 0.28;
      score += Math.min(45, lexicalScore * lexicalWeight);
    }
    if (matchType === "direct" && directMatchIds.includes(supplement.id)) {
      score += 25;
    }
    if (matchType === "semantic" && directMatchIds.includes(supplement.id)) {
      score += 18;
    }
    return { supplement, score };
  });
  scoredSupplements = scoredSupplements.filter(({ score }) => score > 0);
  scoredSupplements = applyProfileAdjustments(scoredSupplements, profile);
  scoredSupplements = applyContextAdjustments(scoredSupplements, context);
  scoredSupplements = filterCurrentSupplements(scoredSupplements, profile?.currentSupplements);
  scoredSupplements = dedupeScoredSupplementsByCanonical(scoredSupplements);
  let screenedSupplements = applySafetyScreening(scoredSupplements, profile);
  screenedSupplements = applyTrackingAdjustments(screenedSupplements, trackingData);
  screenedSupplements = dedupeScoredSupplementsByCanonical(screenedSupplements);
  screenedSupplements = screenedSupplements.filter(({ score }) => score > 0);
  screenedSupplements.sort((a, b) => b.score - a.score);
  const topSupplements = selectDiverseRecommendations(screenedSupplements, matchedGoals, 8);
  const recommendations = topSupplements.map(({ supplement, score, safetyFlags, cautionLevel }) => ({
    supplement,
    priority: determinePriority(score, supplement.evidence),
    reason: generateReason(supplement, matchedGoals, matchedSystems),
    relevanceScore: Math.min(100, Math.round(score)),
    safetyFlags: safetyFlags ?? [],
    cautionLevel
  }));
  const essential = recommendations.filter((r) => r.priority === "essential").slice(0, 2);
  const beneficial = recommendations.filter((r) => r.priority === "beneficial").slice(0, 3);
  const optional = recommendations.filter((r) => r.priority === "optional").slice(0, 2);
  const desiredCount = 6;
  let finalRecommendations = [...essential, ...beneficial, ...optional].slice(0, desiredCount);
  if (finalRecommendations.length < desiredCount) {
    const selectedIds = new Set(finalRecommendations.map((r) => r.supplement.id));
    for (const rec of recommendations) {
      if (finalRecommendations.length >= desiredCount) break;
      if (!selectedIds.has(rec.supplement.id)) {
        finalRecommendations.push(rec);
        selectedIds.add(rec.supplement.id);
      }
    }
  }
  if (matchedGoals.some((goal) => goal.id === "sleep")) {
    const sleepTargetIds = /* @__PURE__ */ new Set();
    if (profile) {
      for (const target of buildNutrientTargets(profile)) {
        if (target.rationale.some((item) => item.toLowerCase().includes("sleep"))) {
          for (const supplementId of target.supplementIds) {
            sleepTargetIds.add(supplementId);
          }
        }
      }
    }
    const sleepCandidates = screenedSupplements.filter(({ supplement }) => normalizeGoals(supplement.goals).includes("sleep") || sleepTargetIds.has(supplement.id)).sort((a, b) => b.score - a.score);
    const sleepRecommendations = /* @__PURE__ */ new Map();
    for (const { supplement, score, safetyFlags, cautionLevel } of sleepCandidates) {
      if (!sleepRecommendations.has(supplement.id)) {
        sleepRecommendations.set(supplement.id, {
          supplement,
          priority: determinePriority(score, supplement.evidence),
          reason: generateReason(supplement, matchedGoals, matchedSystems),
          relevanceScore: Math.min(100, Math.round(score)),
          safetyFlags: safetyFlags ?? [],
          cautionLevel
        });
      }
    }
    if (sleepRecommendations.size > 0) {
      const mergedRecommendations = /* @__PURE__ */ new Map();
      for (const rec of finalRecommendations) {
        mergedRecommendations.set(rec.supplement.id, rec);
      }
      for (const rec of sleepRecommendations.values()) {
        mergedRecommendations.set(rec.supplement.id, rec);
      }
      finalRecommendations = Array.from(mergedRecommendations.values());
    }
  }
  const matchTypeSignal = {
    direct: 0.28,
    keyword: 0.24,
    semantic: 0.18,
    none: 0.05
  };
  const goalSignal = Math.min(0.35, matchedGoals.length * 0.09);
  const systemSignal = Math.min(0.2, matchedSystems.length * 0.06);
  const recommendationSignal = Math.min(0.2, finalRecommendations.length * 0.03);
  const highRiskPenalty = finalRecommendations.some((rec) => rec.cautionLevel === "high") ? 0.08 : 0;
  const confidence = Math.max(
    0.15,
    Math.min(
      0.95,
      matchTypeSignal[matchType ?? "none"] + goalSignal + systemSignal + recommendationSignal - highRiskPenalty
    )
  );
  const recommendedStacks = getRecommendedStacks(profile, matchedGoals.map((goal) => goal.id));
  const tips = generateTips(matchedGoals, profile);
  if (recommendedStacks.length > 0 && matchedGoals.some((goal) => INTIMACY_GOALS.has(goal.id))) {
    tips.unshift("Consider a pre-made intimacy or reproductive health stack to combine synergistic nutrients and adaptogens.");
  }
  return {
    query: input,
    identifiedGoals: matchedGoals.map((g) => g.id),
    identifiedSystems: matchedSystems.map((s) => s.id),
    recommendations: finalRecommendations,
    tips,
    recommendedStacks,
    matchType,
    confidence,
    directSupplements: directMatchIds,
    relatedSupplements: relatedMatchIds,
    inferredGoals,
    inferredSystems
  };
}
function generateTips(matchedGoals, profile) {
  const tips = [];
  for (const goal of matchedGoals.slice(0, 2)) {
    switch (goal.id) {
      case "sleep":
        tips.push("For sleep: Avoid screens 1 hour before bed, keep bedroom cool (65-68\xB0F), and maintain consistent sleep/wake times.");
        break;
      case "stress":
        tips.push("For stress: Deep breathing, regular exercise, and limiting caffeine can enhance supplement effectiveness.");
        break;
      case "energy":
        tips.push("For energy: Ensure adequate sleep, stay hydrated, and consider timing supplements in the morning.");
        break;
      case "focus":
        tips.push("For focus: Minimize multitasking, take regular breaks, and consider time-blocking your work.");
        break;
      case "digestion":
        tips.push("For digestion: Eat slowly, chew thoroughly, and consider spacing supplements away from meals if GI upset occurs.");
        break;
      case "immunity":
        tips.push("For immunity: Prioritize sleep, manage stress, and maintain good hand hygiene alongside supplementation.");
        break;
      case "fitness":
        tips.push("For fitness: Time protein/creatine around workouts, stay hydrated, and allow adequate recovery between sessions.");
        break;
      case "metabolic":
        tips.push("For blood sugar: Balance meals with protein/fiber, reduce late-night sugar, and prioritize daily movement.");
        break;
      case "detox":
        tips.push("For liver support: Limit alcohol, stay hydrated, and emphasize cruciferous vegetables.");
        break;
      case "longevity":
        tips.push("For longevity: Focus on sleep, resistance training, and a nutrient-dense diet alongside supplements.");
        break;
    }
  }
  if (profile) {
    if (profile.diet === "vegan") {
      tips.push("As a vegan, pay special attention to B12, omega-3 (algae-based), iron, and zinc status.");
    }
    if (profile.sleepQuality === "poor") {
      tips.push("With poor sleep, prioritize sleep hygiene alongside supplements. Magnesium and glycine work best with consistent sleep timing.");
    }
    if (profile.stressLevel === "high" || profile.stressLevel === "very-high") {
      tips.push("High stress increases nutrient depletion. Consider a B-complex and magnesium as foundational support.");
    }
  }
  tips.push("Start with 1-2 supplements, assess for 2-4 weeks, then add more if needed. More is not always better.");
  return tips.slice(0, 4);
}

// src/data/supplements.ts
var supplements = [
  // ============ AYURVEDIC HERBS ============
  /** Source: STACKS_ALIGNMENT_RESEARCH_REPORT.md */
  {
    id: "ashwagandha",
    name: "Ashwagandha (Withania somnifera)",
    type: "ayurvedic",
    category: "both",
    description: "Premier Ayurvedic adaptogen used for over 3000 years. KSM-66 (root, ~5% withanolides) and Sensoril (root + leaf, ~10% withanolides) are the best-studied extracts.",
    traditionalUse: "In Ayurveda, classified as a Rasayana (rejuvenative) and Balya (strength-giving). Used to promote longevity, vitality, and as a general tonic for weakness.",
    mechanism: "Acts as an adaptogen by modulating HPA-axis stress response and reducing cortisol while supporting GABAergic calm.",
    benefits: ["Reduces cortisol 14-28%", "Decreases anxiety", "Improves sleep quality", "Supports testosterone", "Enhances strength gains", "Reduces stress"],
    dosage: "300-600mg/day for stress or sleep (KSM-66 or Sensoril). 600-1000mg/day for performance or hormonal goals.",
    timing: "Morning or evening, with food. Evening if using for sleep.",
    timeframe: "Stress relief within 2-4 weeks. Strength/hormonal effects 6-8 weeks.",
    evidence: "strong",
    evidenceSources: [
      {
        title: "NCCIH: Ashwagandha",
        url: "https://www.nccih.nih.gov/health/ashwagandha",
        note: "Overview of clinical evidence and safety considerations."
      }
    ],
    foodSources: ["Not available in food - supplement only"],
    cautions: ["May cause mild GI upset initially", "Can be overly sedating for some", "Long-term continuous use may cause anhedonia (emotional blunting) in rare cases", "Cyclical use recommended to prevent potential anhedonia (emotional blunting)", "Discontinue once pregnancy is confirmed due to limited human pregnancy data", "Rare case reports of reversible liver injury at high doses."],
    drugInteractions: ["Thyroid medications", "Immunosuppressants", "Sedatives", "Blood pressure medications"],
    avoidIf: ["Pregnancy (discontinue once pregnant)", "Breastfeeding", "Hyperthyroidism", "Autoimmune conditions (use with caution)"],
    cycleTiming: "Can use continuously, but some prefer 8 weeks on, 2 weeks off",
    synergies: ["Rhodiola (for stress)", "Magnesium (for sleep)", "Shilajit (for energy)"],
    conflicts: [],
    systems: ["nervous", "endocrine", "immune", "muscular"],
    goals: ["stress", "anxiety", "sleep", "energy", "testosterone", "muscle", "recovery", "libido", "sexual-health", "cortisol", "fertility", "male-reproductive", "sperm-quality", "sperm-count", "sperm-motility"]
  },
  /** Source: STACKS_ALIGNMENT_RESEARCH_REPORT.md */
  {
    id: "brahmi-bacopa",
    name: "Brahmi / Bacopa monnieri",
    type: "ayurvedic",
    category: "both",
    description: 'Classical Ayurvedic "Medhya Rasayana" (brain tonic). One of the most well-researched nootropics with consistent memory-enhancing effects.',
    traditionalUse: "Used for thousands of years in Ayurveda to enhance memory, learning, and concentration. Given to students and scholars. Also used for anxiety and epilepsy.",
    benefits: ["Significantly enhances memory", "Improves learning speed", "Reduces anxiety", "Antioxidant for brain", "Neuroprotective", "Supports focus"],
    dosage: "300-600mg standardized to 45% bacosides",
    timing: "With fatty food (bacosides are fat-soluble). Morning or split doses.",
    timeframe: "8-12 weeks for full cognitive benefits. Anxiety relief faster (2-4 weeks).",
    evidence: "strong",
    foodSources: ["Not available in food - supplement only"],
    cautions: ["May cause GI upset initially - start low", "Can be mildly sedating for some"],
    drugInteractions: ["Thyroid medications", "Calcium channel blockers", "Anticholinergic drugs"],
    avoidIf: ["Pregnancy", "Breastfeeding", "Slow heart rate (bradycardia)"],
    cycleTiming: "Best used continuously for cognitive effects. Effects build over time.",
    synergies: ["Lion's Mane", "Gotu Kola", "Alpha-GPC", "DHA"],
    conflicts: ["Anticholinergic medications"],
    systems: ["nervous", "cognitive"],
    goals: ["memory", "focus", "cognition", "learning", "anxiety", "brain-health", "neuroprotection"]
  },
  /** Source: STACKS_ALIGNMENT_RESEARCH_REPORT.md */
  {
    id: "brahmi",
    name: "Brahmi (Bacopa monnieri)",
    type: "ayurvedic",
    category: "both",
    description: "Ayurvedic nootropic herb for memory, learning, and cognitive resilience. Often standardized to bacosides.",
    traditionalUse: "Used as a Medhya Rasayana (brain tonic) to enhance memory and calm the nervous system.",
    benefits: ["Memory enhancement", "Learning support", "Anxiety reduction", "Neuroprotection", "Focus support"],
    dosage: "300-600mg standardized to 45-50% bacosides",
    timing: "With food (fat-soluble). Morning or split doses.",
    timeframe: "Cognitive benefits build over 8-12 weeks.",
    evidence: "strong",
    foodSources: ["Not commonly used as food; supplement form preferred"],
    cautions: ["May cause GI upset initially", "Can be mildly sedating for some"],
    drugInteractions: ["Thyroid medications", "Anticholinergics", "Sedatives"],
    avoidIf: ["Pregnancy", "Bradycardia"],
    cycleTiming: "Use continuously for cognitive benefits.",
    synergies: ["Lion's Mane", "Ginkgo", "Omega-3"],
    conflicts: ["Anticholinergic medications"],
    systems: ["nervous", "cognitive"],
    goals: ["memory", "focus", "cognition", "stress", "brain-health"]
  },
  {
    id: "tulsi",
    name: "Tulsi / Holy Basil (Ocimum sanctum)",
    type: "ayurvedic",
    category: "both",
    description: 'Sacred herb known as "The Incomparable One" and "Queen of Herbs." Adaptogen for stress with antimicrobial and immune-modulating properties.',
    traditionalUse: "Considered sacred in Hindu tradition. Used for respiratory conditions, stress, fever, and as a daily tonic. Every part of the plant is used medicinally.",
    benefits: ["Reduces cortisol", "Balances stress response", "Supports blood sugar", "Antimicrobial", "Immune modulation", "Respiratory health"],
    dosage: "300-600mg extract or 2-3 cups tea daily",
    timing: "Any time. Tea can be consumed throughout the day.",
    timeframe: "Calming effects within days. Metabolic effects 4-8 weeks.",
    evidence: "moderate",
    foodSources: ["Fresh tulsi leaves in cooking", "Tulsi tea"],
    cautions: ["May lower blood sugar - monitor if diabetic"],
    drugInteractions: ["Blood thinners", "Diabetes medications"],
    avoidIf: ["Trying to conceive (may have anti-fertility effects)", "Before surgery"],
    cycleTiming: "Can be used continuously as tea. Extracts may benefit from cycling.",
    synergies: ["Ashwagandha", "Ginger", "Turmeric"],
    conflicts: [],
    systems: ["nervous", "immune", "respiratory", "metabolic"],
    goals: ["stress", "anxiety", "immunity", "blood-sugar", "respiratory", "adaptogen"]
  },
  {
    id: "shatavari",
    name: "Shatavari (Asparagus racemosus)",
    type: "ayurvedic",
    category: "both",
    description: 'Ayurvedic "Queen of Herbs" - premier female reproductive tonic. Name means "she who has 100 husbands" implying vitality. Also benefits men.',
    traditionalUse: "Primary female rejuvenative in Ayurveda. Used for fertility, lactation, menopause, and as a general tonic. Considered cooling and nourishing.",
    benefits: ["Female hormonal support", "Fertility enhancement", "Lactation support", "Menopause symptoms", "Digestive soothing", "Adaptogenic"],
    dosage: "500-1000mg extract daily",
    timing: "With warm milk or water. Traditional to take with ghee for better absorption.",
    timeframe: "Hormonal effects 4-8 weeks. Digestive soothing faster.",
    evidence: "moderate",
    foodSources: ["Not commonly available as food"],
    cautions: ["May cause weight gain in some due to nourishing quality", "Pregnancy safety data are limited; avoid high doses without supervision"],
    drugInteractions: ["Diuretics", "Lithium"],
    avoidIf: ["Pregnancy (precaution due to limited data)", "Estrogen-sensitive conditions (use with caution)", "Kidney disorders"],
    cycleTiming: "Can be used continuously. Often used throughout menstrual cycle.",
    synergies: ["Ashwagandha", "Licorice", "Fennel"],
    conflicts: [],
    systems: ["reproductive", "digestive", "immune"],
    goals: ["hormonal-balance", "fertility", "menopause", "lactation", "vitality", "women-health", "female-reproductive", "ovulation", "cervical-mucus"]
  },
  {
    id: "triphala",
    name: "Triphala",
    type: "ayurvedic",
    category: "traditional",
    description: "Classical three-fruit formula (Amalaki, Bibhitaki, Haritaki). Premier digestive and gentle detox remedy. Balances all three doshas.",
    traditionalUse: 'Most widely used Ayurvedic formula. "Tri" (three) "Phala" (fruits). Said to care for the body like a mother cares for her children. Used daily for longevity.',
    benefits: ["Gentle detoxification", "Promotes regularity", "Digestive tonic", "Powerful antioxidant", "Supports all tissues", "Balances doshas"],
    dosage: "500-1000mg or 1/2 tsp powder before bed",
    timing: "Before bed with warm water for overnight cleansing. Or morning on empty stomach.",
    timeframe: "Digestive effects within 1-2 weeks. Deeper cleansing over months.",
    evidence: "moderate",
    foodSources: ["Not available - traditional formula"],
    cautions: ["May cause loose stools initially - start with lower dose"],
    drugInteractions: ["May affect absorption of other medications - take separately"],
    avoidIf: ["Pregnancy", "Diarrhea", "Severe debility (too cleansing)"],
    cycleTiming: "Can be used continuously. Traditional long-term daily use.",
    synergies: ["Ginger", "Warm water", "Psyllium"],
    conflicts: [],
    systems: ["digestive", "detox"],
    goals: ["digestion", "detox", "regularity", "antioxidant", "longevity", "gut-health"]
  },
  {
    id: "guduchi",
    name: "Guduchi / Giloy (Tinospora cordifolia)",
    type: "ayurvedic",
    category: "both",
    description: 'Called "Amrita" meaning divine nectar. Powerful immune modulator and rasayana. One of the most versatile Ayurvedic herbs.',
    traditionalUse: "Used for fever, infections, liver support, and as an immune tonic. Said to provide protection equal to nectar of immortality.",
    benefits: ["Immune modulation", "Liver support", "Fever reduction", "Reduces inflammation", "Blood purification", "Anti-allergic"],
    dosage: "300-500mg extract daily",
    timing: "Any time. Often combined with other herbs.",
    timeframe: "Immune effects 2-4 weeks. Chronic condition support longer.",
    evidence: "moderate",
    foodSources: ["Fresh juice from stems (traditional)"],
    cautions: ["May lower blood sugar - monitor if diabetic"],
    drugInteractions: ["Immunosuppressants", "Diabetes medications"],
    avoidIf: ["Autoimmune conditions (may stimulate immune system)", "Pregnancy"],
    cycleTiming: "Can be used continuously for immune support.",
    synergies: ["Tulsi", "Neem", "Turmeric"],
    conflicts: [],
    systems: ["immune", "hepatic", "metabolic"],
    goals: ["immunity", "liver", "inflammation", "allergy", "detox", "fever"]
  },
  {
    id: "shilajit",
    name: "Shilajit",
    type: "ayurvedic",
    category: "both",
    description: 'Ancient mineral resin from Himalayas, rich in fulvic acid and 80+ minerals. Called "Destroyer of Weakness" and "Conqueror of Mountains."',
    traditionalUse: "Premier rejuvenative for vitality and longevity. Used to enhance the effects of other herbs. Considered one of the most important substances in Ayurveda.",
    benefits: ["Enhances mitochondrial function", "Increases CoQ10 effectiveness", "Supports testosterone", "Reduces fatigue", "Mineral transport", "Anti-aging"],
    dosage: "250-500mg purified extract daily",
    timing: "Morning with warm water or milk",
    timeframe: "Energy effects 1-2 weeks. Hormonal/deeper effects 4-8 weeks.",
    evidence: "moderate",
    foodSources: ["Not available in food"],
    cautions: ["Use only purified, tested products - raw form may contain heavy metals"],
    drugInteractions: ["May enhance effects of other supplements"],
    avoidIf: ["Hemochromatosis (iron overload)", "Gout", "Pregnancy"],
    cycleTiming: "Traditional: use continuously. Some suggest 3 months on, 1 month off.",
    synergies: ["Ashwagandha", "CoQ10", "Any herb (enhances absorption)"],
    conflicts: [],
    systems: ["energy", "endocrine", "muscular", "cognitive"],
    goals: ["energy", "vitality", "testosterone", "anti-aging", "mitochondria", "mineral-absorption"]
  },
  {
    id: "arjuna",
    name: "Arjuna (Terminalia arjuna)",
    type: "ayurvedic",
    category: "both",
    description: "Premier Ayurvedic heart tonic. Named after the warrior from Mahabharata. The bark has been used for cardiac support for thousands of years.",
    traditionalUse: "Used primarily for heart conditions including angina, heart failure, and high blood pressure. Also used for wound healing.",
    benefits: ["Strengthens heart muscle", "Blood pressure support", "Cholesterol support", "Antioxidant", "Improves circulation", "Cardioprotective"],
    dosage: "500mg bark extract twice daily",
    timing: "With water, traditionally with milk",
    timeframe: "Blood pressure effects 2-4 weeks. Cardiac strengthening over months.",
    evidence: "moderate",
    foodSources: ["Not available in food"],
    cautions: ["May enhance effects of heart medications"],
    drugInteractions: ["Blood pressure medications", "Cardiac glycosides", "Blood thinners"],
    avoidIf: ["Consult doctor if on any heart medications"],
    cycleTiming: "Used continuously for heart support under practitioner guidance.",
    synergies: ["CoQ10", "Hawthorn", "Omega-3"],
    conflicts: [],
    systems: ["cardiovascular"],
    goals: ["heart-health", "blood-pressure", "cholesterol", "circulation", "cardiac"]
  },
  {
    id: "amla",
    name: "Amla / Amalaki (Emblica officinalis)",
    type: "ayurvedic",
    category: "both",
    description: "Indian gooseberry with one of the highest natural vitamin C contents. Key ingredient in Triphala and Chyawanprash.",
    traditionalUse: "One of the most important rasayanas. Used for longevity, immunity, hair and skin health. Main ingredient in the rejuvenative formula Chyawanprash.",
    benefits: ["Extremely high vitamin C", "Powerful antioxidant", "Hair and skin health", "Immune support", "Liver protection", "Anti-aging"],
    dosage: "500-1000mg extract or 1-2 fresh fruits daily",
    timing: "Any time. Traditional with honey.",
    timeframe: "Antioxidant effects immediate. Hair/skin effects over weeks to months.",
    evidence: "moderate",
    foodSources: ["Fresh amla fruit", "Amla juice", "Amla pickle", "Chyawanprash"],
    cautions: ["Very sour taste - may need to combine with other flavors"],
    drugInteractions: ["May enhance absorption of iron", "Blood thinners (high vitamin C)"],
    avoidIf: ["Generally very safe for all"],
    cycleTiming: "Can and should be used continuously.",
    synergies: ["Haritaki", "Bibhitaki (as Triphala)", "Turmeric"],
    conflicts: [],
    systems: ["immune", "skin", "digestive", "hepatic"],
    goals: ["immunity", "antioxidant", "skin", "hair", "liver", "longevity", "vitamin-c"]
  },
  {
    id: "turmeric-curcumin",
    name: "Turmeric / Curcumin",
    type: "ayurvedic",
    category: "both",
    description: "Golden spice of India with powerful anti-inflammatory effects. Curcumin is the active compound. Best results come from delivery-enhanced forms.",
    traditionalUse: "Used in Ayurveda for digestive issues, wounds, inflammation, and as a blood purifier. Central to Indian cooking and medicine.",
    mechanism: "Curcuminoids modulate NF-\xCE\xBAB and COX-2 pathways to reduce inflammatory signaling.",
    benefits: ["Powerful anti-inflammatory", "Joint pain relief", "Antioxidant", "Brain health", "Mood support", "Digestive aid"],
    dosage: "500-1000mg curcumin in phytosome, liposomal, or nanoparticle form",
    timing: "With meals containing fat for absorption (if applicable to product)",
    timeframe: "Inflammation reduction 2-4 weeks. Joint effects 4-8 weeks.",
    evidence: "strong",
    evidenceSources: [
      {
        title: "NCCIH: Turmeric",
        url: "https://www.nccih.nih.gov/health/turmeric",
        note: "Evidence summary and safety considerations."
      }
    ],
    foodSources: ["Turmeric spice", "Golden milk", "Curry dishes"],
    cautions: ["May cause GI upset at high doses", "Can thin blood", "Outdated claims that piperine boosts absorption by 2000% are not supported by recent data", "Piperine provides only modest absorption gains compared with newer delivery forms"],
    drugInteractions: ["Blood thinners", "Diabetes medications", "Acid-reducing drugs"],
    avoidIf: ["Gallbladder disease", "Before surgery", "Pregnancy (high doses)"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Ginger", "Boswellia", "Omega-3"],
    conflicts: ["Take separately from iron supplements"],
    systems: ["immune", "musculoskeletal", "digestive", "nervous"],
    goals: ["inflammation", "joint-pain", "brain-health", "digestion", "antioxidant", "mood"]
  },
  {
    id: "turmeric",
    name: "Turmeric",
    type: "ayurvedic",
    category: "both",
    description: "Golden Ayurvedic spice with curcuminoids that modulate inflammatory pathways. Whole turmeric is useful in diet; concentrated curcumin extracts are used for therapeutic doses.",
    traditionalUse: "Used for digestive complaints, joint pain, and wound healing in Ayurveda. Core spice in Indian cooking.",
    benefits: ["Anti-inflammatory support", "Antioxidant", "Joint support", "Digestive comfort", "Brain health"],
    dosage: "500-2000mg turmeric extract daily or 1-2 tsp turmeric powder in food",
    timing: "With meals containing fat",
    timeframe: "Inflammation benefits 2-4 weeks.",
    evidence: "strong",
    foodSources: ["Turmeric spice", "Golden milk", "Curry dishes"],
    cautions: ["May thin blood at high doses", "Can upset stomach in large amounts"],
    drugInteractions: ["Blood thinners", "Diabetes medications", "Acid-reducing drugs"],
    avoidIf: ["Gallbladder disease", "Before surgery", "Pregnancy (high doses)"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Black pepper (piperine)", "Ginger", "Omega-3"],
    conflicts: ["Take separately from iron supplements"],
    systems: ["immune", "musculoskeletal", "digestive", "nervous"],
    goals: ["inflammation", "joint-pain", "digestion", "brain-health", "antioxidant"]
  },
  {
    id: "ginger",
    name: "Ginger (Zingiber officinale)",
    type: "ayurvedic",
    category: "traditional",
    description: "Warming root with anti-nausea and anti-inflammatory properties. Supports digestion and circulation.",
    traditionalUse: "Used in Ayurveda and traditional Chinese medicine for digestion, nausea, and circulation.",
    benefits: ["Nausea relief", "Digestive support", "Anti-inflammatory", "Circulation support", "Pain relief"],
    dosage: "500-2000mg extract daily or 1-2g fresh ginger",
    timing: "Any time. Before meals for digestion.",
    timeframe: "Nausea relief can be immediate. Inflammation benefits 2-4 weeks.",
    evidence: "strong",
    foodSources: ["Fresh ginger root", "Ginger tea", "Ginger powder"],
    cautions: ["May cause heartburn in some", "Large doses may thin blood"],
    drugInteractions: ["Blood thinners", "Diabetes medications"],
    avoidIf: ["Before surgery", "Bleeding disorders"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Turmeric", "Triphala", "Peppermint"],
    conflicts: [],
    systems: ["digestive", "cardiovascular", "immune"],
    goals: ["digestion", "nausea", "inflammation", "immunity"]
  },
  {
    id: "gotu-kola",
    name: "Gotu Kola (Centella asiatica)",
    type: "ayurvedic",
    category: "both",
    description: 'Called "Brahmi" in some traditions (different from Bacopa). Known for longevity - Sri Lankan elephants eat it. Supports brain and skin.',
    traditionalUse: "Used for memory, wound healing, and longevity. Said that those who eat it daily will live 100+ years. Also used for venous insufficiency.",
    benefits: ["Memory enhancement", "Wound healing", "Reduces anxiety", "Improves circulation", "Skin health", "Collagen support"],
    dosage: "250-500mg extract daily",
    timing: "With food",
    timeframe: "Anxiety effects 2-4 weeks. Wound healing faster. Cognitive effects 4-8 weeks.",
    evidence: "moderate",
    foodSources: ["Fresh leaves in salads (Southeast Asian cuisines)", "Gotu kola juice"],
    cautions: ["May cause drowsiness", "Sun sensitivity possible"],
    drugInteractions: ["Sedatives", "Hepatotoxic drugs", "Cholesterol medications"],
    avoidIf: ["Liver disease", "Pregnancy"],
    cycleTiming: "Cycle 2-3 weeks on, 1 week off recommended.",
    synergies: ["Bacopa", "Lion's Mane", "Ginkgo"],
    conflicts: [],
    systems: ["nervous", "circulatory", "skin"],
    goals: ["memory", "anxiety", "wound-healing", "circulation", "skin", "longevity"]
  },
  /** Source: STACKS_ALIGNMENT_RESEARCH_REPORT.md */
  {
    id: "mucuna",
    name: "Mucuna pruriens (Kapikacchu)",
    type: "ayurvedic",
    category: "both",
    description: 'Natural source of L-DOPA (dopamine precursor). Used for mood, libido, and male fertility. Called "velvet bean."',
    traditionalUse: "Used in Ayurveda for male fertility, libido, nervous system disorders, and as a rejuvenative. Sacred in some traditions.",
    safetyNote: "Discontinue immediately upon positive pregnancy test.",
    benefits: ["Dopamine support", "Mood enhancement", "Male fertility", "Libido support", "Testosterone support", "Stress relief"],
    dosage: "500-1000mg standardized extract (5-10% L-DOPA)",
    timing: "Morning on empty stomach or light breakfast (protein can reduce absorption)",
    timeframe: "Mood effects 1-2 weeks. Fertility effects 3 months.",
    evidence: "moderate",
    foodSources: ["Not commonly consumed as food due to processing required"],
    cautions: ["May cause nausea, headache, or jitteriness in some", "Can be stimulating; avoid late-day dosing"],
    drugInteractions: ["MAOIs", "Parkinson's medications (carbidopa/levodopa)", "Psychiatric medications", "Antipsychotics"],
    avoidIf: ["Parkinson's (unless supervised)", "Psychotic disorders", "Heart arrhythmias", "Pregnancy"],
    cycleTiming: "Cycle 5 days on, 2 days off. Or 4 weeks on, 1 week off.",
    synergies: ["Ashwagandha", "Tribulus", "Shilajit"],
    conflicts: ["Other dopaminergic substances"],
    systems: ["nervous", "reproductive", "endocrine"],
    goals: ["dopamine", "mood", "libido", "sexual-health", "fertility", "motivation", "testosterone", "male-reproductive", "sperm-quality", "sexual-performance"]
  },
  {
    id: "boswellia",
    name: "Boswellia / Shallaki (Boswellia serrata)",
    type: "ayurvedic",
    category: "both",
    description: "Indian frankincense. Powerful anti-inflammatory that inhibits 5-LOX enzyme. Premier joint support herb in Ayurveda.",
    traditionalUse: "Used for inflammatory conditions, joint pain, respiratory issues, and bowel disorders. Resin used in religious ceremonies.",
    benefits: ["Powerful anti-inflammatory", "Joint pain relief", "5-LOX inhibition", "Improves mobility", "Gut inflammation support", "Respiratory health"],
    dosage: "300-500mg standardized extract (AKBA 30%) 2-3x daily",
    timing: "With meals",
    timeframe: "Joint pain relief 1-2 weeks. Full effects 4-8 weeks.",
    evidence: "strong",
    foodSources: ["Not available in food"],
    cautions: ["May cause GI upset or acid reflux in some"],
    drugInteractions: ["NSAIDs (may enhance)", "Blood thinners"],
    avoidIf: ["Pregnancy", "Breastfeeding"],
    cycleTiming: "Can be used continuously for joint support.",
    synergies: ["Curcumin", "Omega-3", "Glucosamine", "MSM"],
    conflicts: [],
    systems: ["musculoskeletal", "immune", "digestive"],
    goals: ["joint-pain", "inflammation", "mobility", "arthritis", "gut-health"]
  },
  {
    id: "jatamansi",
    name: "Jatamansi (Nardostachys jatamansi)",
    type: "ayurvedic",
    category: "traditional",
    description: 'Ayurvedic relative of valerian. Known as "Indian Spikenard." Premier herb for calming the mind and promoting sleep.',
    traditionalUse: "Used for mental disorders, insomnia, and nervous system conditions. Also used for hair health and skin conditions.",
    benefits: ["Calms mind", "Promotes deep sleep", "Reduces anxiety", "Memory support", "Grounding effect", "Hair health"],
    dosage: "250-500mg extract daily",
    timing: "Evening or before bed",
    timeframe: "Sleep effects within days. Mental calm 1-2 weeks.",
    evidence: "moderate",
    foodSources: ["Not available in food"],
    cautions: ["May cause drowsiness"],
    drugInteractions: ["Sedatives", "CNS depressants"],
    avoidIf: ["Pregnancy", "Breastfeeding", "Operating machinery"],
    cycleTiming: "Can be used continuously for sleep support.",
    synergies: ["Ashwagandha", "Brahmi", "Valerian"],
    conflicts: [],
    systems: ["nervous"],
    goals: ["sleep", "anxiety", "calm", "memory", "grounding"]
  },
  {
    id: "shankhpushpi",
    name: "Shankhpushpi (Convolvulus pluricaulis)",
    type: "ayurvedic",
    category: "traditional",
    description: 'Classical Ayurvedic "Medhya" herb for intellect and mental clarity. Name refers to conch-shell shaped flowers.',
    traditionalUse: "Primary brain tonic in Ayurveda. Used for memory, intelligence, concentration, and reducing mental fatigue. Given to students.",
    benefits: ["Enhances memory", "Supports concentration", "Reduces anxiety", "Calms nervous system", "Intelligence support", "Sleep quality"],
    dosage: "250-500mg extract daily",
    timing: "Any time",
    timeframe: "Calming effects 1-2 weeks. Cognitive enhancement 4-8 weeks.",
    evidence: "moderate",
    foodSources: ["Not available in food"],
    cautions: ["May cause drowsiness in some"],
    drugInteractions: ["CNS depressants", "Anticholinergic drugs"],
    avoidIf: ["Pregnancy", "Breastfeeding"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Brahmi", "Gotu Kola", "Ashwagandha"],
    conflicts: [],
    systems: ["nervous", "cognitive"],
    goals: ["memory", "focus", "concentration", "anxiety", "intelligence", "calm"]
  },
  {
    id: "guggulu",
    name: "Guggulu (Commiphora mukul)",
    type: "ayurvedic",
    category: "traditional",
    description: "Resin from the Mukul myrrh tree. Classical Ayurvedic remedy for joint health, cholesterol, and weight management.",
    traditionalUse: "One of the most important substances in Ayurveda. Used for arthritis, obesity, atherosclerosis, and skin diseases. Often combined with other herbs.",
    benefits: ["Joint mobility", "Cholesterol support", "Thyroid support", "Weight management", "Inflammation reduction", "Detoxification"],
    dosage: "500-1000mg standardized extract (guggulsterones)",
    timing: "With warm water, 2-3 times daily",
    timeframe: "Cholesterol effects 4-8 weeks. Joint effects 2-4 weeks.",
    evidence: "moderate",
    foodSources: ["Not available in food"],
    cautions: ["May cause skin rash, diarrhea, or nausea"],
    drugInteractions: ["Thyroid medications", "Blood thinners", "Estrogen/progesterone"],
    avoidIf: ["Pregnancy", "Breastfeeding", "Hyperthyroidism", "Liver disease"],
    cycleTiming: "Traditionally used for 3-month cycles.",
    synergies: ["Triphala", "Trikatu", "Boswellia"],
    conflicts: [],
    systems: ["metabolic", "musculoskeletal", "endocrine"],
    goals: ["joint-health", "cholesterol", "weight", "thyroid", "inflammation"]
  },
  {
    id: "trikatu",
    name: "Trikatu",
    type: "ayurvedic",
    category: "traditional",
    description: 'Classical "Three Pungents" formula: Ginger, Black Pepper, Long Pepper. Kindles digestive fire and enhances absorption.',
    traditionalUse: "Used to stimulate Agni (digestive fire), enhance absorption of other herbs, reduce Ama (toxins), and support respiratory health.",
    benefits: ["Stimulates digestion", "Enhances nutrient absorption", "Reduces bloating", "Respiratory support", "Metabolism boost", "Warming"],
    dosage: "250-500mg before meals",
    timing: "Before meals with warm water",
    timeframe: "Digestive effects within days.",
    evidence: "moderate",
    foodSources: ["Can make at home: equal parts ginger, black pepper, long pepper powders"],
    cautions: ["May cause heartburn or GI irritation", "Very heating"],
    drugInteractions: ["May enhance absorption of other medications"],
    avoidIf: ["Hyperacidity", "Ulcers", "Inflammatory GI conditions", "Pregnancy (high doses)"],
    cycleTiming: "Use as needed for digestive support.",
    synergies: ["Other Ayurvedic formulas (enhances their effect)", "Curcumin"],
    conflicts: ["Antacids (opposite effects)"],
    systems: ["digestive", "respiratory", "metabolic"],
    goals: ["digestion", "absorption", "bloating", "metabolism", "respiratory"]
  },
  {
    id: "chyawanprash",
    name: "Chyawanprash",
    type: "ayurvedic",
    category: "traditional",
    description: "Ancient Ayurvedic rejuvenative jam with 40+ herbs, primarily amla-based. Named after sage Chyawan who was rejuvenated by it.",
    traditionalUse: "The premier Rasayana (rejuvenative) formula. Said to be created by the Ashwini Kumaras to restore youth to the elderly sage Chyawan.",
    benefits: ["Overall vitality", "Immune support", "Antioxidant rich", "Respiratory health", "Digestive support", "Rejuvenation"],
    dosage: "1-2 teaspoons daily",
    timing: "Morning with warm milk. Can also take in evening.",
    timeframe: "Energy effects 1-2 weeks. Deeper rejuvenation over months.",
    evidence: "moderate",
    foodSources: ["Only as prepared formula - traditional paste/jam"],
    cautions: ["Contains sugar/honey - diabetics should use sugar-free versions", "Quality varies by brand"],
    drugInteractions: ["Generally safe, but check with practitioner if on medications"],
    avoidIf: ["Diabetes (regular versions)", "Acute fever or infection"],
    cycleTiming: "Used continuously, especially in winter months.",
    synergies: ["Warm milk", "Ghee"],
    conflicts: [],
    systems: ["immune", "respiratory", "digestive", "energy"],
    goals: ["immunity", "vitality", "longevity", "rejuvenation", "respiratory", "antioxidant"]
  },
  // ============ WESTERN & OTHER HERBS ============
  {
    id: "rhodiola",
    name: "Rhodiola Rosea",
    type: "herb",
    category: "both",
    description: 'Arctic "golden root" adaptogen. Helps body resist physical and mental stress. Used by Vikings and Russian cosmonauts.',
    traditionalUse: "Traditional in Scandinavian and Russian medicine for fatigue, stress, and high-altitude sickness. Used by Sherpas and Olympic athletes.",
    benefits: ["Reduces mental fatigue", "Improves stress resilience", "Enhances mental performance", "Supports mood", "Physical endurance", "Anti-fatigue"],
    dosage: "200-600mg standardized to 3% rosavins, 1% salidroside",
    timing: "Morning on empty stomach. Avoid evening (stimulating).",
    timeframe: "Energy/focus effects within days. Stress adaptation 2-4 weeks.",
    evidence: "strong",
    foodSources: ["Not available in food"],
    cautions: ["May be too stimulating for some", "Can cause insomnia if taken late"],
    drugInteractions: ["SSRIs", "MAOIs", "Stimulants"],
    avoidIf: ["Bipolar disorder (may trigger mania)", "Severe anxiety (may worsen initially)"],
    cycleTiming: "Cycle 3 weeks on, 1 week off recommended.",
    synergies: ["Ashwagandha (balances stimulating effect)", "Eleuthero", "Cordyceps"],
    conflicts: ["May not mix well with caffeine for sensitive individuals"],
    systems: ["nervous", "endocrine", "energy"],
    goals: ["stress", "energy", "focus", "fatigue", "mental-performance", "endurance", "mood"]
  },
  {
    id: "schisandra",
    name: "Schisandra Berry (Wu Wei Zi)",
    type: "herb",
    category: "traditional",
    description: 'The "Five Flavor Fruit" of TCM. A dual-direction adaptogen that can calm anxiety while increasing focus. Premier liver tonic.',
    traditionalUse: 'Used by hunters and athletes for endurance. Used in TCM to "astringe leaking jing" (preserve essence).',
    benefits: ["Liver detoxification (Phase 1 & 2)", "Sharpshooter focus", "Stress resilience", "Skin beauty", "Adrenal support"],
    dosage: "500-1000mg fruit extract or tea",
    timing: "Morning or afternoon",
    timeframe: "Focus effects within 1 hour. Liver/Skin effects 4-8 weeks.",
    evidence: "strong",
    foodSources: ["Dried berries (very sour/bitter)", "Tea"],
    cautions: ["Increases stomach acid", "Do not use during acute infection (binds heat)"],
    drugInteractions: ["Changes liver metabolism of many drugs (CYP enzymes)"],
    avoidIf: ["GERD/Acid reflux", "Peptic ulcers", "Pregnancy"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Rhodiola", "Ginseng", "Milk Thistle"],
    conflicts: [],
    systems: ["hepatic", "nervous", "endocrine", "skin"],
    goals: ["liver", "focus", "beauty", "stress", "detox", "endurance"]
  },
  {
    id: "andrographis",
    name: "Andrographis (Kalmegh/King of Bitters)",
    type: "ayurvedic",
    category: "traditional",
    description: 'Extremely bitter herb known as "Indian Echinacea." Powerful immune support, often superior to Echinacea for acute upper respiratory issues.',
    traditionalUse: "Traditional Ayurvedic remedy for fevers, liver disorders, and digestive weakness.",
    benefits: ["Acute immune support", "Reduces fever", "Liver protection", "Gut antimicrobial", "Respiratory health"],
    dosage: "400mg standard extract (30% andrographolides)",
    timing: "At onset of illness. 3x daily.",
    timeframe: "Acute immune response within 24-48 hours.",
    evidence: "strong",
    foodSources: ["None (too bitter for food)"],
    cautions: ["Can cause gastric upset", "Bitter taste can linger"],
    drugInteractions: ["Blood pressure meds", "Immunosuppressants", "Blood thinners"],
    avoidIf: ["Autoimmune conditions", "Gallbladder disease", "Pregnancy (abortifacient effects)"],
    cycleTiming: "Use for acute illness (max 2 weeks). Not for daily long-term use.",
    synergies: ["Elderberry", "Zinc", "Vitamin C"],
    conflicts: [],
    systems: ["immune", "hepatic", "respiratory"],
    goals: ["cold", "flu", "immunity", "fever", "infection"]
  },
  {
    id: "saw-palmetto",
    name: "Saw Palmetto",
    type: "herb",
    category: "traditional",
    description: "Top natural remedy for prostate health and male hair loss. Inhibits 5-alpha-reductase (prevents T converting to DHT).",
    traditionalUse: "Native American remedy for urinary and reproductive issues.",
    benefits: ["Prostate support (BPH)", "Reduces urinary frequency", "Blocks DHT", "Male pattern baldness support"],
    dosage: "320mg standardized extract (85-95% fatty acids)",
    timing: "Divided doses with food",
    timeframe: "Urinary benefits 4-6 weeks. Hair effects 3-6 months.",
    evidence: "moderate",
    foodSources: ["Not available in food"],
    cautions: ["Mild digestive upset"],
    drugInteractions: ["Blood thinners", "Hormone therapies"],
    avoidIf: ["Pregnancy", "Breastfeeding"],
    cycleTiming: "Used continuously.",
    synergies: ["Pumpkin Seed Oil", "Pygeum", "Stinging Nettle"],
    conflicts: [],
    systems: ["reproductive", "urinary", "endocrine"],
    goals: ["beauty", "hormones"]
  },
  {
    id: "black-pepper",
    name: "Black Pepper Extract (Piperine)",
    type: "herb",
    category: "traditional",
    description: "Bioavailability enhancer that increases absorption of some nutrients and herbal compounds. Piperine is the active alkaloid.",
    traditionalUse: "Used in Ayurveda as part of Trikatu to enhance digestion and absorption.",
    benefits: ["Enhances nutrient absorption", "Digestive support", "Mild thermogenic effect"],
    dosage: "5-20mg piperine daily (often included in formulas)",
    timing: "With meals or alongside supplements",
    timeframe: "Absorption effects are immediate with dosing.",
    evidence: "strong",
    foodSources: ["Black pepper spice"],
    cautions: ["May increase absorption of medications", "Can irritate stomach in some"],
    drugInteractions: ["Many medications (can increase absorption)", "Blood thinners"],
    avoidIf: ["Active ulcers or GERD flare-ups"],
    cycleTiming: "Use as needed when paired with other supplements.",
    synergies: ["Turmeric", "CoQ10", "Curcumin formulas"],
    conflicts: [],
    systems: ["digestive"],
    goals: ["digestion", "absorption", "inflammation"]
  },
  /** Source: STACKS_ALIGNMENT_RESEARCH_REPORT.md */
  {
    id: "tongkat-ali",
    name: "Tongkat Ali / Longjack (Eurycoma longifolia)",
    type: "herb",
    category: "both",
    description: 'Malaysian "ginseng" known for testosterone and stress support. Clinically studied water extracts include LJ100\xC2\xAE (standardized glycosaponins, eurypeptides, eurycomanone).',
    traditionalUse: "Traditional Southeast Asian remedy for energy, male vitality, and fever. Used by athletes and as an aphrodisiac.",
    benefits: ["Supports testosterone", "Reduces cortisol", "Improves body composition", "Enhances libido", "Reduces fatigue", "Improves mood"],
    dosage: "100-200mg/day of water extract (e.g., LJ100\xC2\xAE). Up to 300mg/day for athletic support.",
    timing: "Morning with food (water extract preferred)",
    timeframe: "Energy effects 1-2 weeks. Hormonal effects 4-8 weeks.",
    evidence: "strong",
    foodSources: ["Not available in food"],
    cautions: ["May cause restlessness or insomnia", "May increase aggression in some", "Avoid non-water extracts due to inconsistent safety"],
    drugInteractions: ["Blood pressure medications", "Diabetes medications", "Immunosuppressants"],
    avoidIf: ["Hormone-sensitive cancers", "Pregnancy", "Breastfeeding", "Heart conditions"],
    cycleTiming: "Cycle 5 days on, 2 off. Or 4 weeks on, 1 week off.",
    synergies: ["Ashwagandha", "Shilajit", "Zinc"],
    conflicts: [],
    systems: ["endocrine", "energy", "reproductive"],
    goals: ["testosterone", "libido", "sexual-health", "energy", "cortisol", "body-composition", "fatigue"]
  },
  {
    id: "maca",
    name: "Maca Root (Lepidium meyenii)",
    type: "herb",
    category: "both",
    description: "Peruvian cruciferous root vegetable. Human fertility data are weak/mixed; libido effects are more consistent. Black maca is most studied for sperm parameters; red maca for menopause/bone support; yellow maca for general vitality.",
    traditionalUse: "Grown in harsh Andean conditions for thousands of years. Traditional for fertility, energy, and as a food staple.",
    benefits: ["Increases energy", "Supports libido", "Mood support", "Menopause symptoms", "Athletic performance"],
    dosage: "1500-3500mg daily (gelatinized powder; black maca preferred for fertility goals)",
    timing: "Morning with food. Can split doses.",
    timeframe: "Energy effects 2-4 weeks. Libido/hormonal effects 6-8 weeks.",
    evidence: "limited",
    foodSources: ["Maca powder in smoothies", "Maca flour in baking"],
    cautions: ["May cause GI upset", "Goitrogenic (affects thyroid in sensitive individuals)", "Consider stopping once pregnant due to limited pregnancy data", "Evidence for semen parameters is weak; libido support is more consistent"],
    drugInteractions: ["Theoretically may affect thyroid medications"],
    avoidIf: ["Pregnancy (insufficient safety data)", "Thyroid conditions (use with caution)", "Hormone-sensitive conditions"],
    cycleTiming: "Cycle 2-3 months on, 1 month off.",
    synergies: ["Ashwagandha", "Tribulus", "Cacao"],
    conflicts: [],
    systems: ["endocrine", "energy", "reproductive"],
    goals: ["energy", "libido", "sexual-health", "hormonal-balance", "menopause", "mood", "athletic-performance"]
  },
  {
    id: "lions-mane",
    name: "Lion's Mane (Hericium erinaceus)",
    type: "mushroom",
    category: "both",
    description: "Unique medicinal mushroom that stimulates NGF (Nerve Growth Factor). Supports neuroplasticity and brain health.",
    traditionalUse: "Used in traditional Chinese medicine for digestive and overall health. Buddhist monks used it for concentration.",
    benefits: ["Stimulates NGF", "Enhances memory", "Supports neuroplasticity", "Neuroprotective", "Reduces brain fog", "Mood support"],
    dosage: "500-3000mg daily (fruiting body extract)",
    timing: "Morning with food",
    timeframe: "Some notice effects in 2 weeks. Full benefits 4-8 weeks.",
    evidence: "strong",
    foodSources: ["Fresh or dried lion's mane mushroom (culinary use)"],
    cautions: ["May cause itchy skin in rare cases (possible sign of NGF activity)"],
    drugInteractions: ["Blood thinners (mild effect)", "Diabetes medications"],
    avoidIf: ["Mushroom allergies"],
    cycleTiming: "Can be used continuously. Some cycle for cost reasons.",
    synergies: ["Bacopa", "Phosphatidylserine", "Omega-3"],
    conflicts: [],
    systems: ["nervous", "cognitive", "digestive"],
    goals: ["memory", "focus", "brain-health", "neuroprotection", "cognition", "mood", "brain-fog"]
  },
  {
    id: "reishi",
    name: "Reishi (Ganoderma lucidum)",
    type: "mushroom",
    category: "both",
    description: 'The "Mushroom of Immortality." Calming adaptogen that modulates rather than just stimulates immunity. Promotes longevity.',
    traditionalUse: "Used in Chinese and Japanese medicine for over 2000 years. Associated with spiritual potency, immortality, and longevity.",
    benefits: ["Immune modulation", "Calms nervous system", "Supports sleep", "Adaptogenic", "Liver support", "Anti-cancer research"],
    dosage: "1000-3000mg extract or 3-5g powder daily",
    timing: "Evening (calming). Can split with morning dose.",
    timeframe: "Calming effects 1-2 weeks. Immune modulation 4-8 weeks.",
    evidence: "moderate",
    foodSources: ["Reishi tea", "Reishi coffee blends", "Tinctures"],
    cautions: ["May cause digestive upset", "Can be drying (increase water intake)"],
    drugInteractions: ["Blood thinners", "Immunosuppressants", "Blood pressure medications"],
    avoidIf: ["Bleeding disorders", "Before surgery", "Pregnancy", "Organ transplant"],
    cycleTiming: "Can be used continuously. Often used long-term for immune support.",
    synergies: ["Ashwagandha", "Turkey Tail", "Cordyceps"],
    conflicts: [],
    systems: ["immune", "nervous", "hepatic"],
    goals: ["immunity", "sleep", "calm", "stress", "longevity", "liver"]
  },
  {
    id: "cordyceps",
    name: "Cordyceps (Cordyceps militaris)",
    type: "mushroom",
    category: "both",
    description: "Energy and endurance mushroom. Enhances oxygen utilization and ATP production. Used by Olympic athletes.",
    traditionalUse: "Traditional Tibetan and Chinese medicine for kidney and lung support. Originally found on caterpillars; now cultivated.",
    benefits: ["Increases ATP production", "Enhances endurance", "Supports respiratory function", "Boosts stamina", "Kidney support", "Libido"],
    dosage: "1000-3000mg daily",
    timing: "Morning or pre-workout (energizing)",
    timeframe: "Energy effects 1-2 weeks. Endurance improvements 2-4 weeks.",
    evidence: "moderate",
    foodSources: ["Not commonly available as food"],
    cautions: ["May be too stimulating for some"],
    drugInteractions: ["Blood thinners", "Immunosuppressants", "Diabetes medications"],
    avoidIf: ["Autoimmune conditions (may stimulate immunity)", "Bleeding disorders"],
    cycleTiming: "Can be used continuously or cycled with training phases.",
    synergies: ["CoQ10", "Rhodiola", "Beta-Alanine"],
    conflicts: [],
    systems: ["energy", "respiratory", "immune", "reproductive"],
    goals: ["energy", "endurance", "athletic-performance", "stamina", "libido", "respiratory"]
  },
  {
    id: "chaga",
    name: "Chaga (Inonotus obliquus)",
    type: "mushroom",
    category: "traditional",
    description: "Antioxidant-rich mushroom with immune-modulating and anti-inflammatory properties. Traditionally used as a tea.",
    traditionalUse: "Used in Northern European and Siberian traditions for immune and digestive support.",
    benefits: ["Powerful antioxidant", "Immune support", "Anti-inflammatory", "Blood sugar support", "Gut health"],
    dosage: "1000-2000mg extract daily or 1-2 cups tea",
    timing: "Morning or midday",
    timeframe: "Immune effects 2-4 weeks.",
    evidence: "limited",
    foodSources: ["Chaga tea"],
    cautions: ["High in oxalates", "May affect blood clotting"],
    drugInteractions: ["Blood thinners", "Diabetes medications"],
    avoidIf: ["Kidney stones (oxalates)", "Bleeding disorders"],
    cycleTiming: "Cycle 8-12 weeks on, 2-4 weeks off.",
    synergies: ["Reishi", "Turkey Tail", "Vitamin C"],
    conflicts: [],
    systems: ["immune", "digestive"],
    goals: ["immunity", "inflammation", "longevity", "antioxidant"]
  },
  {
    id: "turkey-tail",
    name: "Turkey Tail (Trametes versicolor)",
    type: "mushroom",
    category: "traditional",
    description: "Immune-modulating mushroom rich in beta-glucans (PSK/PSP). Studied for immune and gut support.",
    traditionalUse: "Used in traditional Asian medicine and as an immune tonic.",
    benefits: ["Immune modulation", "Gut microbiome support", "Prebiotic fiber", "Antioxidant"],
    dosage: "1000-3000mg extract daily",
    timing: "Any time with food",
    timeframe: "Immune support builds over 4-8 weeks.",
    evidence: "moderate",
    foodSources: ["Turkey tail tea or powder (not commonly eaten as food)"],
    cautions: ["May cause mild digestive changes"],
    drugInteractions: ["Immunosuppressants"],
    avoidIf: ["Organ transplant recipients on immunosuppressants"],
    cycleTiming: "Can be used continuously or cycled.",
    synergies: ["Reishi", "Chaga", "Probiotics"],
    conflicts: [],
    systems: ["immune", "digestive"],
    goals: ["immunity", "digestion", "longevity"]
  },
  {
    id: "valerian",
    name: "Valerian Root (Valeriana officinalis)",
    type: "herb",
    category: "both",
    description: "Traditional European sedative herb that increases GABA levels. Distinct odor due to valeric acid.",
    traditionalUse: 'Used since ancient Greek times for insomnia and nervous conditions. Name from Latin "valere" meaning "to be strong."',
    benefits: ["Promotes sleep onset", "Reduces anxiety", "Muscle relaxation", "GABA enhancement", "Reduces sleep latency"],
    dosage: "300-600mg standardized extract",
    timing: "30-60 minutes before bed",
    timeframe: "Sleep effects within days to 2 weeks of regular use.",
    evidence: "moderate",
    foodSources: ["Valerian tea"],
    cautions: ["May cause next-day grogginess", "Distinct unpleasant smell"],
    drugInteractions: ["Sedatives", "Benzodiazepines", "Alcohol", "Anesthesia"],
    avoidIf: ["Pregnancy", "Breastfeeding", "Operating machinery after taking"],
    cycleTiming: "Best for short-term use (2-4 weeks). Take breaks.",
    synergies: ["Lemon Balm", "Passionflower", "Hops", "Magnesium"],
    conflicts: ["Other sedatives (additive effects)"],
    systems: ["nervous"],
    goals: ["sleep", "insomnia", "anxiety", "relaxation"]
  },
  {
    id: "st-johns-wort",
    name: "St. John's Wort (Hypericum perforatum)",
    type: "herb",
    category: "both",
    description: "Most studied herb for mild-moderate depression. Comparable to SSRIs in clinical trials. Named for blooming around St. John's Day.",
    traditionalUse: 'Used since ancient Greece for "melancholia." Traditional wound healer and nerve tonic.',
    benefits: ["Reduces mild-moderate depression", "Anxiety relief", "Mood support", "Menopausal mood symptoms"],
    dosage: "300mg 3x daily (standardized to 0.3% hypericin)",
    timing: "With meals, divided throughout day",
    timeframe: "4-6 weeks for antidepressant effects.",
    evidence: "strong",
    foodSources: ["St. John's Wort tea"],
    cautions: ["Causes photosensitivity (sun sensitivity)", "Many drug interactions"],
    drugInteractions: ["Birth control pills", "Blood thinners", "SSRIs/SNRIs", "HIV medications", "Immunosuppressants", "Many others"],
    avoidIf: ["Bipolar disorder", "Pregnancy", "Breastfeeding", "Scheduled surgery", "Taking multiple medications"],
    cycleTiming: "Used continuously under supervision. Don't stop abruptly.",
    synergies: ["SAMe", "Omega-3", "B vitamins"],
    conflicts: ["SSRIs (serotonin syndrome risk)", "Many pharmaceutical drugs"],
    systems: ["nervous"],
    goals: ["depression", "mood", "anxiety", "menopause"]
  },
  {
    id: "passionflower",
    name: "Passionflower (Passiflora incarnata)",
    type: "herb",
    category: "both",
    description: "Gentle nervine that enhances GABA activity. Named by Spanish missionaries who saw religious symbolism in the flower.",
    traditionalUse: "Native American remedy for anxiety and insomnia. Used in traditional medicine for nervous conditions.",
    benefits: ["Reduces anxiety", "Promotes relaxation", "Improves sleep", "Calms racing thoughts", "GABA enhancement"],
    dosage: "250-500mg extract or as tea",
    timing: "As needed for anxiety. Before bed for sleep.",
    timeframe: "Calming effects within 30-60 minutes.",
    evidence: "moderate",
    foodSources: ["Passionflower tea", "Passion fruit (different species but related)"],
    cautions: ["May cause drowsiness"],
    drugInteractions: ["Sedatives", "Blood thinners", "MAOIs"],
    avoidIf: ["Pregnancy", "Breastfeeding", "Before surgery"],
    cycleTiming: "Can be used as needed or continuously for short periods.",
    synergies: ["Valerian", "Lemon Balm", "Chamomile", "L-Theanine"],
    conflicts: [],
    systems: ["nervous"],
    goals: ["anxiety", "sleep", "relaxation", "calm", "racing-thoughts"]
  },
  {
    id: "lemon-balm",
    name: "Lemon Balm (Melissa officinalis)",
    type: "herb",
    category: "both",
    description: "Gentle calming herb from the mint family. Has both anti-anxiety and cognitive-enhancing properties.",
    traditionalUse: "Used since ancient Greece to reduce stress and promote sleep. Also used for digestive complaints and herpes.",
    benefits: ["Reduces anxiety", "Improves mood", "Supports sleep", "Enhances cognitive function", "Gentle and safe", "Digestive support"],
    dosage: "300-600mg extract or 2-4 cups tea",
    timing: "Any time for calm. Before bed for sleep.",
    timeframe: "Calming effects within 1-2 hours.",
    evidence: "moderate",
    foodSources: ["Fresh lemon balm in cooking", "Lemon balm tea"],
    cautions: ["May cause increased appetite"],
    drugInteractions: ["Sedatives", "Thyroid medications"],
    avoidIf: ["Hypothyroidism (may reduce thyroid function)"],
    cycleTiming: "Can be used continuously. Very gentle herb.",
    synergies: ["Valerian", "Passionflower", "Chamomile"],
    conflicts: [],
    systems: ["nervous", "digestive"],
    goals: ["anxiety", "mood", "sleep", "cognition", "digestion", "calm"]
  },
  {
    id: "kava",
    name: "Kava (Piper methysticum)",
    type: "herb",
    category: "traditional",
    description: "Pacific Island ceremonial herb with powerful anti-anxiety effects. Promotes sociability and relaxation without cognitive impairment.",
    traditionalUse: "Central to Pacific Island ceremonies and social gatherings. Used for relaxation, conflict resolution, and rituals.",
    benefits: ["Significant anxiety reduction", "Muscle relaxation", "Promotes sociability", "Maintains mental clarity", "Sleep support"],
    dosage: "120-240mg kavalactones daily",
    timing: "On empty stomach. Evening for sleep.",
    timeframe: "Anxiety effects within 30-60 minutes.",
    evidence: "strong",
    foodSources: ["Traditional kava beverage"],
    cautions: ["May cause skin changes with heavy use", "Can affect liver (rare with quality products)"],
    drugInteractions: ["Alcohol", "Sedatives", "Parkinson's medications", "Liver-metabolized drugs"],
    avoidIf: ["Liver disease", "Depression (may worsen)", "Pregnancy", "Breastfeeding", "Daily alcohol use"],
    cycleTiming: "Not for daily long-term use. Use intermittently. Max 3 months continuous.",
    synergies: ["Works well alone"],
    conflicts: ["Alcohol (never combine)", "Other sedatives"],
    systems: ["nervous", "muscular"],
    goals: ["anxiety", "social-anxiety", "relaxation", "sleep", "muscle-tension"]
  },
  {
    id: "milk-thistle",
    name: "Milk Thistle (Silybum marianum)",
    type: "herb",
    category: "both",
    description: "Premier liver protectant. Silymarin complex protects and regenerates liver cells. Used for hangovers and liver disease.",
    traditionalUse: "Used for over 2000 years for liver and gallbladder disorders. Named for white veins on leaves.",
    benefits: ["Liver protection", "Antioxidant for liver", "Regenerates liver cells", "Toxin protection", "Hangover support", "Cholesterol support"],
    dosage: "200-400mg silymarin (80% extract) daily",
    timing: "With meals",
    timeframe: "Liver protection immediate with exposure. Regeneration over weeks to months.",
    evidence: "strong",
    foodSources: ["Not commonly consumed as food"],
    cautions: ["May cause allergic reaction in people allergic to ragweed"],
    drugInteractions: ["May affect liver enzyme metabolism of many drugs"],
    avoidIf: ["Hormone-sensitive conditions (weak estrogenic effect)"],
    cycleTiming: "Can be used continuously for liver support.",
    synergies: ["NAC", "Alpha Lipoic Acid", "Dandelion"],
    conflicts: [],
    systems: ["hepatic"],
    goals: ["liver", "detox", "hangover", "liver-protection", "toxin-exposure"]
  },
  {
    id: "elderberry",
    name: "Elderberry (Sambucus nigra)",
    type: "herb",
    category: "both",
    description: "Traditional antiviral berry with strong evidence for reducing cold and flu duration. Rich in anthocyanins.",
    traditionalUse: 'Used in European folk medicine for colds, flu, and fever. "Medicine chest of the country people."',
    benefits: ["Reduces cold/flu duration", "Antiviral properties", "Rich in anthocyanins", "Immune activation", "Anti-inflammatory"],
    dosage: "500-1000mg extract daily during illness",
    timing: "At first sign of illness, continue for 5 days",
    timeframe: "May reduce illness duration by 2-4 days.",
    evidence: "strong",
    foodSources: ["Elderberry syrup", "Elderberry jam"],
    cautions: ["Raw berries are toxic - only use properly prepared products"],
    drugInteractions: ["Immunosuppressants", "Diabetes medications"],
    avoidIf: ["Autoimmune conditions (may stimulate immune system)", "During cytokine storm concerns"],
    cycleTiming: "Use at onset of illness. Not for continuous daily use typically.",
    synergies: ["Zinc", "Vitamin C", "Echinacea"],
    conflicts: [],
    systems: ["immune"],
    goals: ["cold", "flu", "immunity", "antiviral", "respiratory"]
  },
  {
    id: "ginkgo",
    name: "Ginkgo Biloba",
    type: "herb",
    category: "both",
    description: "Extract from ancient tree species (200+ million years). Improves cerebral blood flow and has antioxidant effects.",
    traditionalUse: "Used in Traditional Chinese Medicine for brain and lungs. One of the oldest living tree species.",
    benefits: ["Improves brain circulation", "Supports memory", "Antioxidant", "May help tinnitus", "Eye health", "Peripheral circulation"],
    dosage: "120-240mg standardized extract (24% flavonoids, 6% terpenes)",
    timing: "Morning with food",
    timeframe: "Circulation effects 2-4 weeks. Cognitive effects 4-8 weeks.",
    evidence: "moderate",
    foodSources: ["Not commonly consumed as food"],
    cautions: ["May increase bleeding risk"],
    drugInteractions: ["Blood thinners", "NSAIDs", "SSRIs", "Anticonvulsants"],
    avoidIf: ["Bleeding disorders", "Before surgery", "Seizure disorders"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Bacopa", "Phosphatidylserine", "Vinpocetine"],
    conflicts: ["Blood thinners (increased bleeding risk)"],
    systems: ["circulatory", "nervous", "cognitive"],
    goals: ["memory", "circulation", "brain-health", "tinnitus", "eyes", "cognitive"]
  },
  {
    id: "echinacea",
    name: "Echinacea",
    type: "herb",
    category: "both",
    description: "Native American immune herb. May help prevent and shorten upper respiratory infections.",
    traditionalUse: "Most widely used medicinal plant by Native American tribes. Used for infections, wounds, and snakebites.",
    benefits: ["May prevent colds", "Reduces cold duration", "Immune stimulating", "Anti-inflammatory", "Wound healing"],
    dosage: "300-500mg extract 3x daily",
    timing: "At first sign of illness. Can use preventively during high-risk periods.",
    timeframe: "Best started at first symptoms. Effects within days.",
    evidence: "moderate",
    foodSources: ["Echinacea tea"],
    cautions: ["May cause allergic reactions in people allergic to ragweed family"],
    drugInteractions: ["Immunosuppressants", "Liver-metabolized medications"],
    avoidIf: ["Autoimmune conditions", "Progressive systemic diseases (MS, TB, HIV)", "Ragweed allergy"],
    cycleTiming: "Best for short-term use (10-14 days). Not for continuous use.",
    synergies: ["Elderberry", "Zinc", "Vitamin C", "Astragalus"],
    conflicts: [],
    systems: ["immune"],
    goals: ["immunity", "cold", "flu", "infection", "prevention"]
  },
  {
    id: "ginseng-panax",
    name: "Panax Ginseng (Korean/Asian)",
    type: "herb",
    category: "both",
    description: 'The "true ginseng" - premier adaptogen for energy, cognition, and vitality. "Panax" means "cure-all" in Greek.',
    traditionalUse: "Used in Traditional Chinese Medicine for over 2000 years. Reserved for emperors in ancient times. Most valuable medicinal plant.",
    benefits: ["Reduces fatigue", "Enhances mental performance", "Supports immune function", "Improves mood", "Physical endurance", "Blood sugar support"],
    dosage: "200-400mg standardized extract (4-7% ginsenosides)",
    timing: "Morning (stimulating). Avoid evening.",
    timeframe: "Energy effects within days to 2 weeks. Full adaptogenic effects 4-8 weeks.",
    evidence: "strong",
    foodSources: ["Ginseng tea", "Ginseng soup (Korean cuisine)"],
    cautions: ["May cause insomnia, headache, or digestive upset", "Can increase blood pressure"],
    drugInteractions: ["Blood thinners", "Diabetes medications", "Stimulants", "MAOIs", "Blood pressure medications"],
    avoidIf: ["Hypertension", "Anxiety disorders", "Bipolar disorder", "Hormone-sensitive conditions", "Before surgery"],
    cycleTiming: "Cycle 2-3 weeks on, 1 week off. Or 3 months on, 1 month off.",
    synergies: ["Ginkgo", "Royal Jelly", "Rhodiola"],
    conflicts: ["Caffeine (excessive stimulation)", "Other stimulants"],
    systems: ["energy", "nervous", "immune", "endocrine"],
    goals: ["energy", "fatigue", "cognition", "immunity", "endurance", "mood", "vitality"]
  },
  {
    id: "hawthorn",
    name: "Hawthorn Berry (Crataegus)",
    type: "herb",
    category: "both",
    description: "Traditional heart tonic with evidence for mild heart failure and blood pressure support. Berries, leaves, and flowers used.",
    traditionalUse: "Used in European herbal medicine since the 1st century for heart and digestive complaints.",
    benefits: ["Strengthens heart muscle", "Blood pressure support", "Antioxidant", "Circulation support", "Mild anxiety relief"],
    dosage: "160-900mg standardized extract daily",
    timing: "Divided doses with meals",
    timeframe: "Effects develop over 4-8 weeks.",
    evidence: "moderate",
    foodSources: ["Hawthorn berry jam", "Hawthorn tea"],
    cautions: ["Effects develop slowly - be patient"],
    drugInteractions: ["Heart medications (digoxin)", "Blood pressure medications", "ED medications"],
    avoidIf: ["Consult doctor if on any heart medications"],
    cycleTiming: "Used continuously for heart support.",
    synergies: ["CoQ10", "Magnesium", "Omega-3"],
    conflicts: [],
    systems: ["cardiovascular"],
    goals: ["heart-health", "blood-pressure", "circulation", "anxiety"]
  },
  {
    id: "saffron",
    name: "Saffron (Crocus sativus)",
    type: "herb",
    category: "both",
    description: `The "sunshine spice" with proven antidepressant effects comparable to medications in trials. World's most expensive spice.`,
    traditionalUse: "Used in Persian medicine for depression and mood. Also used for digestion, libido, and menstrual complaints.",
    benefits: ["Antidepressant effects", "Reduces anxiety", "PMS support", "Appetite control", "Eye health", "Memory support"],
    dosage: "30mg standardized extract (2% crocin)",
    timing: "Divided doses (15mg twice daily)",
    timeframe: "Mood effects 4-8 weeks.",
    evidence: "strong",
    foodSources: ["Saffron spice in cooking (expensive)", "Saffron tea"],
    cautions: ["High doses can be toxic (avoid over 5g/day)", "Expensive - watch for adulterated products"],
    drugInteractions: ["Blood thinners", "Blood pressure medications", "SSRIs (may enhance)"],
    avoidIf: ["Pregnancy (high doses can cause contractions)", "Bipolar disorder"],
    cycleTiming: "Can be used continuously at recommended doses.",
    synergies: ["SAMe", "Omega-3", "B vitamins"],
    conflicts: [],
    systems: ["nervous"],
    goals: ["depression", "mood", "anxiety", "pms", "eyes", "appetite"]
  },
  // ============ TEA HERBS ============
  {
    id: "green-tea-matcha",
    name: "Green Tea / Matcha (Camellia sinensis)",
    type: "tea",
    category: "both",
    description: "Polyphenol-rich tea with EGCG and L-theanine for antioxidant and cognitive support. Matcha provides a higher catechin and caffeine concentration.",
    traditionalUse: "Consumed for centuries in China and Japan for calm alertness, digestion, and longevity rituals.",
    benefits: ["Powerful antioxidant support", "Calm alertness and focus", "Cardiovascular support", "Metabolic support", "Supports fat oxidation"],
    dosage: "1-3 cups brewed tea daily or 1-2 tsp matcha powder. Extracts typically 300-800mg EGCG (prefer \xE2\u2030\xA550% EGCG standardization).",
    timing: "Morning or early afternoon. Avoid late evening if caffeine-sensitive.",
    timeframe: "Focus and energy within 30-60 minutes. Metabolic effects over 4-8 weeks.",
    evidence: "strong",
    foodSources: ["Brewed green tea", "Matcha powder"],
    cautions: ["Caffeine sensitivity may cause jitters or insomnia", "May reduce iron absorption if consumed with meals", "Rarely raises liver enzymes with high-dose extracts"],
    drugInteractions: ["Blood thinners (vitamin K content)", "Stimulants"],
    avoidIf: ["Severe caffeine sensitivity", "Iron deficiency (separate from iron-rich meals)", "Active liver disease (avoid high-dose extracts)"],
    cycleTiming: "Can be used continuously. Consider breaks if sensitive to caffeine.",
    synergies: ["L-Theanine", "Citrus (enhances catechin absorption)"],
    conflicts: ["Excess caffeine intake"],
    systems: ["metabolic", "cardiovascular", "nervous"],
    goals: ["energy", "focus", "metabolism", "heart-health", "antioxidant", "weight"]
  },
  {
    id: "peppermint-tea",
    name: "Peppermint (Mentha \xC3\u2014 piperita)",
    type: "tea",
    category: "traditional",
    description: "Carminative tea that relaxes intestinal smooth muscle, easing gas, cramping, and post-meal discomfort. Enteric-coated oil capsules are best studied for IBS.",
    traditionalUse: "Used in European herbalism for digestion, nausea, and headaches.",
    benefits: ["Reduces bloating", "Eases IBS-related cramping", "Soothes nausea", "Supports digestion"],
    dosage: "1-2 cups tea daily or as needed (1-2 tsp dried leaves steeped 5-10 minutes). For IBS: enteric-coated oil 0.2-0.4mL, 2-3x daily.",
    timing: "After meals or during digestive discomfort.",
    timeframe: "Symptom relief within 30-60 minutes.",
    evidence: "moderate",
    foodSources: ["Peppermint tea", "Fresh mint leaves"],
    cautions: ["May worsen acid reflux by relaxing the lower esophageal sphincter", "Enteric-coated oil is preferred for IBS to avoid reflux"],
    drugInteractions: ["Antacids (separate timing if using enteric-coated products)"],
    avoidIf: ["GERD or hiatal hernia"],
    cycleTiming: "Use as needed or daily for digestion.",
    synergies: ["Ginger", "Fennel"],
    conflicts: [],
    systems: ["digestive"],
    goals: ["digestion", "bloating", "ibs", "nausea", "gut-health"]
  },
  {
    id: "chamomile-tea",
    name: "Chamomile (Matricaria chamomilla)",
    type: "tea",
    category: "traditional",
    description: "Gentle calming tea with apigenin that supports relaxation, sleep quality, and digestive comfort.",
    traditionalUse: "European and Middle Eastern remedy for sleep, anxiety, and digestive upset.",
    benefits: ["Promotes relaxation", "Supports sleep quality", "Soothes digestion", "Mild anti-inflammatory"],
    dosage: "1-2 cups in the evening (1-2 tsp dried flowers steeped 5-10 minutes) or 300-500mg extract standardized to \xE2\u2030\xA51.2% apigenin.",
    timing: "Evening or before bed.",
    timeframe: "Calming effects within 30-60 minutes. Sleep benefits within days.",
    evidence: "moderate",
    foodSources: ["Chamomile tea"],
    cautions: ["May cause allergic reactions in those sensitive to ragweed family", "Evidence strongest for sleep quality and GAD rather than acute anxiety relief"],
    drugInteractions: ["Sedatives", "Blood thinners"],
    avoidIf: ["Ragweed allergy"],
    cycleTiming: "Use nightly as needed for sleep.",
    synergies: ["Magnesium", "L-Theanine", "Lavender"],
    conflicts: [],
    systems: ["nervous", "digestive"],
    goals: ["sleep", "anxiety", "stress", "digestion"]
  },
  {
    id: "ginger-tea",
    name: "Ginger (Zingiber officinale)",
    type: "tea",
    category: "both",
    description: "Warming root with evidence for nausea, digestion, and anti-inflammatory support. Gentle daily tea for gut comfort.",
    traditionalUse: "Used in Ayurveda and traditional Chinese medicine for nausea, digestion, and circulation.",
    benefits: ["Reduces nausea", "Supports digestion", "Anti-inflammatory", "Circulation support", "Immune support"],
    dosage: "1-3 cups daily or ~1g fresh ginger root steeped in hot water. Pregnancy nausea: ~1g/day for up to 4 days.",
    timing: "With or after meals; also helpful before travel.",
    timeframe: "Nausea relief within 30-60 minutes. Inflammation support 2-4 weeks.",
    evidence: "strong",
    foodSources: ["Fresh ginger tea", "Ginger slices in cooking"],
    cautions: ["May cause mild heartburn at higher intakes"],
    drugInteractions: ["Blood thinners", "Diabetes medications"],
    avoidIf: ["Gallstones (consult clinician)", "Before surgery (high-dose use)"],
    cycleTiming: "Can be used continuously as a daily tea.",
    synergies: ["Peppermint", "Turmeric", "Lemon"],
    conflicts: [],
    systems: ["digestive", "immune", "circulatory"],
    goals: ["digestion", "nausea", "inflammation", "immunity"]
  },
  {
    id: "hibiscus-tea",
    name: "Hibiscus (Hibiscus sabdariffa)",
    type: "tea",
    category: "traditional",
    description: "Tart, anthocyanin-rich tea with strong evidence for blood pressure support and cardiovascular benefits.",
    traditionalUse: "Used in Africa, the Caribbean, and the Middle East for cooling and cardiovascular support.",
    benefits: ["Supports healthy blood pressure", "Antioxidant support", "Cardiovascular support", "Mild diuretic effect"],
    dosage: "1.5-3g dried calyx daily (about 1-3 cups tea).",
    timing: "Any time; morning or afternoon preferred.",
    timeframe: "Blood pressure benefits in 2-6 weeks with consistent use.",
    evidence: "strong",
    foodSources: ["Hibiscus tea"],
    cautions: ["May lower blood pressure; monitor if already on antihypertensives"],
    drugInteractions: ["Blood pressure medications", "Thiazide diuretics"],
    avoidIf: ["Low blood pressure"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Beetroot", "Magnesium", "Potassium-rich foods"],
    conflicts: [],
    systems: ["cardiovascular", "metabolic"],
    goals: ["blood-pressure", "heart-health", "antioxidant"]
  },
  {
    id: "cinnamon-tea",
    name: "Cinnamon (Cinnamomum verum/cassia)",
    type: "tea",
    category: "traditional",
    description: "Aromatic bark with evidence for blood sugar and metabolic support. Ceylon cinnamon is preferred for lower coumarin.",
    traditionalUse: "Used across traditional medicine systems for warming digestion and circulation.",
    benefits: ["Blood sugar support", "Metabolic support", "Antioxidant effects", "Digestive comfort"],
    dosage: "1-2 cups daily or 1-2g cinnamon steeped in hot water.",
    timing: "With meals, especially carbohydrate-heavy meals.",
    timeframe: "Blood sugar effects 4-8 weeks with consistent use.",
    evidence: "moderate",
    foodSources: ["Cinnamon tea", "Cinnamon spice in foods"],
    cautions: ["Cassia cinnamon contains more coumarin; avoid excessive long-term high doses"],
    drugInteractions: ["Diabetes medications", "Blood thinners"],
    avoidIf: ["Liver disease (limit cassia cinnamon)", "Pregnancy (high-dose use)"],
    cycleTiming: "Use consistently with breaks if using high doses.",
    synergies: ["Ginger", "Chromium", "Berberine"],
    conflicts: [],
    systems: ["metabolic", "digestive"],
    goals: ["blood-sugar", "metabolism", "digestion", "antioxidant"]
  },
  {
    id: "greek-mountain-tea",
    name: "Greek Mountain Tea (Sideritis scardica/raeseri)",
    type: "tea",
    category: "traditional",
    description: "Traditional Greek mountain tea rich in acteoside and flavones, used for cognitive support, respiratory comfort, and digestion.",
    traditionalUse: "Consumed across Greece as a daily tonic for respiratory comfort, digestion, and resilience.",
    benefits: ["Supports cognitive function", "Neuroprotective antioxidant support", "Respiratory comfort", "Digestive protection", "Stress resilience"],
    dosage: "2-4g dried herb decoction (simmer 3-5 minutes) or 1-2 cups tea daily.",
    timing: "Any time; afternoon or evening is common.",
    timeframe: "Cognitive and calming effects within 2-4 weeks with consistent use.",
    evidence: "moderate",
    foodSources: ['Dried stems/flowers ("Tsai tou vounou") brewed as tea'],
    cautions: ["Very high safety profile; monitor if highly sensitive to herbs"],
    drugInteractions: ["No known significant interactions"],
    avoidIf: ["No specific restrictions known"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Honey", "Lemon", "Chamomile"],
    conflicts: [],
    systems: ["nervous", "respiratory", "digestive"],
    goals: ["brain-health", "memory", "cognition", "respiratory", "digestion", "stress"]
  },
  {
    id: "dittany-of-crete",
    name: "Dittany of Crete (Origanum dictamnus)",
    type: "tea",
    category: "traditional",
    description: "Cretan herb with carvacrol-rich aromatics used for digestive comfort, throat soothing, and traditional wound healing.",
    traditionalUse: "Used in Crete for digestive and respiratory comfort and as a traditional remedy for wounds.",
    benefits: ["Digestive soothing", "Antimicrobial support", "Throat comfort", "Menstrual cramp relief"],
    dosage: "1-2g dried leaves infused 5-10 minutes; 1-2 cups daily.",
    timing: "After meals or in the evening.",
    timeframe: "Digestive comfort within hours; menstrual support over 1-2 cycles.",
    evidence: "limited",
    foodSources: ['Dried velvety leaves ("Erontas") brewed as tea'],
    cautions: ["Avoid during pregnancy (traditional uterine stimulant history)", "May have mild blood-thinning effect"],
    drugInteractions: ["Blood thinners (use with caution)"],
    avoidIf: ["Pregnancy"],
    cycleTiming: "Use as needed; avoid prolonged high intake.",
    synergies: ["Honey", "Lemon", "Ginger"],
    conflicts: [],
    systems: ["digestive", "reproductive", "respiratory"],
    goals: ["digestion", "pms", "immunity", "respiratory"]
  },
  {
    id: "lemon-verbena",
    name: "Lemon Verbena (Aloysia citrodora)",
    type: "tea",
    category: "traditional",
    description: "Aromatic lemony herb rich in verbascoside used for relaxation, sleep quality, and muscle recovery support.",
    traditionalUse: "Mediterranean tea for relaxation, digestion, and evening wind-down.",
    benefits: ["Supports sleep quality", "Muscle recovery support", "Digestive relaxation", "Calming effect"],
    dosage: "2-3 cups daily, preferably in the evening.",
    timing: "Evening or after meals.",
    timeframe: "Relaxation within days; recovery support over 2-4 weeks.",
    evidence: "moderate",
    foodSources: ["Dried lemon verbena leaves brewed as tea"],
    cautions: ["Rare kidney irritation with prolonged high intake", "Avoid excessive use in pregnancy"],
    drugInteractions: ["Sedatives (additive calming effects)"],
    avoidIf: ["Pregnancy (avoid excessive intake)"],
    cycleTiming: "Use nightly or in short cycles if using high doses.",
    synergies: ["Chamomile", "Magnesium", "Lavender"],
    conflicts: [],
    systems: ["nervous", "muscular", "digestive"],
    goals: ["sleep", "recovery", "digestion", "anxiety", "stress"]
  },
  {
    id: "olive-leaf",
    name: "Olive Leaf (Olea europaea)",
    type: "tea",
    category: "traditional",
    description: "Oleuropein-rich leaf used for cardiovascular and immune support, with evidence for blood pressure and metabolic benefits.",
    traditionalUse: "Mediterranean remedy for cardiovascular support and immune resilience.",
    benefits: ["Supports healthy blood pressure", "Cholesterol support", "Immune support", "Blood sugar regulation", "Antioxidant protection"],
    dosage: "500-1000mg extract standardized to 15-20% oleuropein or strong tea daily.",
    timing: "Morning or with meals.",
    timeframe: "Blood pressure and metabolic benefits in 4-8 weeks.",
    evidence: "strong",
    foodSources: ["Olive leaf tea"],
    cautions: ["May lower blood pressure; monitor with antihypertensives", "Possible die-off reaction at high doses"],
    drugInteractions: ["Blood pressure medications", "Diabetes medications"],
    avoidIf: ["Low blood pressure"],
    cycleTiming: "Can be used continuously; reduce dose if lightheaded.",
    synergies: ["Hibiscus", "Magnesium", "Omega-3"],
    conflicts: [],
    systems: ["cardiovascular", "immune", "metabolic"],
    goals: ["blood-pressure", "heart-health", "immunity", "blood-sugar", "cholesterol", "antioxidant"]
  },
  {
    id: "white-tea-silver-needle",
    name: "White Tea - Silver Needle (Camellia sinensis)",
    type: "tea",
    category: "both",
    description: "Premium white tea made from young buds and minimal processing for high antioxidant retention.",
    traditionalUse: "Traditional Chinese tonic for skin, longevity, and gentle daily vitality.",
    mechanism: "Catechins (including EGCG) reduce oxidative stress and support metabolic balance.",
    benefits: ["Antioxidant protection", "Supports skin health", "Metabolic support"],
    dosage: "1-2 cups daily.",
    timing: "Morning or early afternoon.",
    timeframe: "4-8 weeks for noticeable antioxidant and metabolic benefits.",
    evidence: "moderate",
    evidenceSources: [
      {
        title: "Tea\xE2\u20AC\u2122s anti-obesity properties - PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10563719",
        note: "Cardiometabolic benefits across tea polyphenols."
      },
      {
        title: "White Tea Benefits - Healthline",
        url: "https://www.healthline.com/nutrition/white-tea-benefits",
        note: "Overview of antioxidants and potential benefits."
      }
    ],
    foodSources: ["Silver Needle white tea"],
    cautions: ["Contains caffeine (lower than green/black tea)"],
    drugInteractions: ["Stimulants (additive caffeine)"],
    avoidIf: ["Severe caffeine sensitivity"],
    cycleTiming: "Can be used continuously.",
    synergies: ["L-Theanine", "Citrus"],
    conflicts: ["Excess caffeine intake"],
    systems: ["metabolic", "cardiovascular", "nervous"],
    goals: ["antioxidant", "skin", "metabolism", "energy", "heart-health"]
  },
  {
    id: "white-tea-white-peony",
    name: "White Tea - White Peony (Bai Mudan) (Camellia sinensis)",
    type: "tea",
    category: "both",
    description: "White tea made from buds and leaves with gentle floral notes and balanced antioxidants.",
    traditionalUse: "Used in Chinese tea culture for relaxation and daily wellness.",
    mechanism: "Polyphenols support antioxidant defenses and cardiovascular health.",
    benefits: ["Heart health", "Antioxidant support", "Immune support"],
    dosage: "2-3 cups daily.",
    timing: "Any time; earlier if caffeine-sensitive.",
    timeframe: "4-12 weeks for cardiovascular support.",
    evidence: "moderate",
    evidenceSources: [
      {
        title: "Green Tea Knowledge - PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11899301",
        note: "Camellia sinensis polyphenols and antioxidant activity."
      }
    ],
    foodSources: ["White Peony (Bai Mudan) tea"],
    cautions: ["Contains caffeine"],
    drugInteractions: ["Stimulants (additive caffeine)"],
    avoidIf: ["Severe caffeine sensitivity"],
    cycleTiming: "Can be used continuously.",
    synergies: ["L-Theanine", "Citrus"],
    conflicts: ["Excess caffeine intake"],
    systems: ["cardiovascular", "immune", "metabolic"],
    goals: ["heart-health", "immunity", "antioxidant", "metabolism"]
  },
  {
    id: "green-tea-sencha",
    name: "Green Tea - Sencha (Camellia sinensis)",
    type: "tea",
    category: "both",
    description: "Steamed Japanese green tea with grassy flavor and strong catechin content.",
    traditionalUse: "Daily Japanese tea for vitality and metabolic balance.",
    mechanism: "EGCG supports metabolic rate and antioxidant defenses.",
    benefits: ["Metabolic support", "Cardiovascular support", "Cognitive support"],
    dosage: "2-4 cups daily.",
    timing: "Throughout the day; avoid late evening.",
    timeframe: "4-12 weeks for metabolic and cardiovascular benefits.",
    evidence: "strong",
    evidenceSources: [
      {
        title: "Green Tea Benefits - Healthline",
        url: "https://www.healthline.com/nutrition/top-10-evidence-based-health-benefits-of-green-tea",
        note: "Evidence for metabolic and cardiovascular support."
      },
      {
        title: "Green Tea Knowledge - PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11899301",
        note: "Mechanisms and bioactive compounds."
      }
    ],
    foodSources: ["Sencha green tea"],
    cautions: ["Caffeine sensitivity may cause jitters or insomnia"],
    drugInteractions: ["Blood thinners (vitamin K content)", "Stimulants"],
    avoidIf: ["Severe caffeine sensitivity"],
    cycleTiming: "Can be used continuously.",
    synergies: ["L-Theanine", "Citrus"],
    conflicts: ["Excess caffeine intake"],
    systems: ["metabolic", "cardiovascular", "nervous"],
    goals: ["energy", "focus", "metabolism", "heart-health", "antioxidant", "weight"]
  },
  {
    id: "yellow-tea-huang-ya",
    name: "Yellow Tea - Huang Ya (Camellia sinensis)",
    type: "tea",
    category: "traditional",
    description: "Rare lightly oxidized yellow tea with mellow flavor and gentle antioxidant profile.",
    traditionalUse: "Chinese tea tradition for gentle detox and digestion.",
    mechanism: "Flavonoids support antioxidant and metabolic balance.",
    benefits: ["Weight management support", "Liver support", "Antioxidant support"],
    dosage: "2-4 cups daily.",
    timing: "Any time.",
    timeframe: "4-8 weeks for metabolic support.",
    evidence: "limited",
    evidenceSources: [
      {
        title: "Yellow Tea Supplement - PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5793303",
        note: "Metabolic and lipid effects in tea polyphenols."
      }
    ],
    foodSources: ["Yellow tea (Huang Ya)"],
    cautions: ["Contains caffeine"],
    drugInteractions: ["Stimulants (additive caffeine)"],
    avoidIf: ["Severe caffeine sensitivity"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Citrus", "L-Theanine"],
    conflicts: ["Excess caffeine intake"],
    systems: ["metabolic", "hepatic"],
    goals: ["metabolism", "weight", "liver", "antioxidant"]
  },
  {
    id: "oolong-tea-tieguanyin",
    name: "Oolong Tea - Tieguanyin (Camellia sinensis)",
    type: "tea",
    category: "both",
    description: "Partially oxidized oolong tea with floral notes and balanced caffeine.",
    traditionalUse: "Chinese tea for digestion and metabolic support.",
    mechanism: "Theaflavins and catechins support insulin sensitivity and lipid metabolism.",
    benefits: ["Weight management support", "Blood sugar support", "Heart health"],
    dosage: "2-4 cups daily.",
    timing: "Morning or afternoon.",
    timeframe: "4-8 weeks for metabolic benefits.",
    evidence: "moderate",
    evidenceSources: [
      {
        title: "Oolong Benefits - Healthline",
        url: "https://www.healthline.com/nutrition/oolong-tea-benefits",
        note: "Fat oxidation and metabolic support."
      },
      {
        title: "Oolong Metabolic Rate - ScienceDirect",
        url: "https://www.sciencedirect.com/science/article/pii/S0022316622144937",
        note: "Clinical trials on energy expenditure."
      }
    ],
    foodSources: ["Tieguanyin oolong tea"],
    cautions: ["Contains caffeine"],
    drugInteractions: ["Stimulants (additive caffeine)"],
    avoidIf: ["Severe caffeine sensitivity"],
    cycleTiming: "Can be used continuously.",
    synergies: ["L-Theanine", "Citrus"],
    conflicts: ["Excess caffeine intake"],
    systems: ["metabolic", "cardiovascular"],
    goals: ["metabolism", "blood-sugar", "heart-health", "weight"]
  },
  {
    id: "black-tea-assam",
    name: "Black Tea - Assam (Camellia sinensis)",
    type: "tea",
    category: "both",
    description: "Robust black tea with malty flavor and higher caffeine content.",
    traditionalUse: "Traditional Indian tea for alertness and daily vitality.",
    mechanism: "Theaflavins support lipid balance and antioxidant defenses.",
    benefits: ["Heart health", "Alertness", "Antioxidant support"],
    dosage: "2-4 cups daily.",
    timing: "Morning.",
    timeframe: "4-12 weeks for cardiovascular support.",
    evidence: "strong",
    evidenceSources: [
      {
        title: "Black Tea Benefits - PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6512146",
        note: "Polyphenols and cardiovascular markers."
      },
      {
        title: "Black Tea - Healthline",
        url: "https://www.healthline.com/nutrition/black-tea-benefits",
        note: "Overview of evidence and benefits."
      }
    ],
    foodSources: ["Assam black tea"],
    cautions: ["Higher caffeine content may cause jitters or insomnia"],
    drugInteractions: ["Stimulants (additive caffeine)"],
    avoidIf: ["Severe caffeine sensitivity"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Milk (if tolerated)", "L-Theanine"],
    conflicts: ["Excess caffeine intake"],
    systems: ["cardiovascular", "nervous", "metabolic"],
    goals: ["heart-health", "energy", "focus", "antioxidant"]
  },
  {
    id: "dark-tea-pu-erh-sheng",
    name: "Dark Tea - Pu-erh Sheng (Raw) (Camellia sinensis)",
    type: "tea",
    category: "traditional",
    description: "Aged fermented tea with earthy flavor and traditional digestive use.",
    traditionalUse: "Chinese tea for digestion and lipid balance.",
    mechanism: "Theabrownins and fermented compounds support gut microbiota and lipid metabolism.",
    benefits: ["Cholesterol support", "Weight management support", "Digestive support"],
    dosage: "2-4 cups daily.",
    timing: "After meals.",
    timeframe: "4-12 weeks for lipid and metabolic benefits.",
    evidence: "moderate",
    evidenceSources: [
      {
        title: "Pu-erh Benefits - Healthline",
        url: "https://www.healthline.com/health/food-nutrition/pu-erh-tea-benefits",
        note: "Overview of lipid and metabolic support."
      },
      {
        title: "Pu-erh Nervous System - PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5533841",
        note: "Bioactive compounds and neuroprotection."
      }
    ],
    foodSources: ["Pu-erh tea"],
    cautions: ["Contains caffeine"],
    drugInteractions: ["Stimulants (additive caffeine)"],
    avoidIf: ["Severe caffeine sensitivity"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Ginger", "Lemon"],
    conflicts: ["Excess caffeine intake"],
    systems: ["digestive", "metabolic"],
    goals: ["cholesterol", "weight", "digestion", "metabolism"]
  },
  {
    id: "smoked-tea-lapsang-souchong",
    name: "Smoked Tea - Lapsang Souchong (Camellia sinensis)",
    type: "tea",
    category: "traditional",
    description: "Pine-smoked black tea with bold aroma and antioxidant content.",
    traditionalUse: "Chinese tea used for warming digestion and flavor variety.",
    mechanism: "Polyphenols support antioxidant defenses.",
    benefits: ["Antioxidant support", "Digestive comfort"],
    dosage: "1-2 cups daily.",
    timing: "With meals.",
    timeframe: "4-8 weeks for antioxidant benefits.",
    evidence: "limited",
    evidenceSources: [
      {
        title: "Lapsang Souchong Guide",
        url: "https://theuklooseleafteacompany.co.uk/blogs/news/what-is-lapsang-souchong-tea",
        note: "Traditional use and digestion notes."
      }
    ],
    foodSources: ["Lapsang Souchong tea"],
    cautions: ["Contains caffeine", "Smoky flavor can be intense for sensitive users"],
    drugInteractions: ["Stimulants (additive caffeine)"],
    avoidIf: ["Severe caffeine sensitivity"],
    cycleTiming: "Use occasionally or daily as tolerated.",
    synergies: ["Milk (if tolerated)", "Citrus"],
    conflicts: ["Excess caffeine intake"],
    systems: ["digestive", "metabolic"],
    goals: ["digestion", "antioxidant"]
  },
  {
    id: "english-breakfast-tea",
    name: "English Breakfast (Black Tea Blend)",
    type: "tea",
    category: "both",
    description: "Blend of black teas traditionally enjoyed in the morning for alertness.",
    traditionalUse: "British morning ritual for energy and focus.",
    mechanism: "Caffeine and theaflavins support alertness and cardiovascular markers.",
    benefits: ["Energy boost", "Heart health", "Antioxidant support"],
    dosage: "1-3 cups daily.",
    timing: "Morning.",
    timeframe: "Immediate alertness; cardiovascular benefits over 4-8 weeks.",
    evidence: "strong",
    evidenceSources: [
      {
        title: "Black Tea Benefits - PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6512146",
        note: "Evidence applicable to black tea blends."
      }
    ],
    foodSources: ["English breakfast tea"],
    cautions: ["Contains caffeine"],
    drugInteractions: ["Stimulants (additive caffeine)"],
    avoidIf: ["Severe caffeine sensitivity"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Milk (if tolerated)", "L-Theanine"],
    conflicts: ["Excess caffeine intake"],
    systems: ["cardiovascular", "nervous"],
    goals: ["energy", "focus", "heart-health", "antioxidant"]
  },
  {
    id: "earl-grey-tea",
    name: "Earl Grey (Bergamot Black Tea)",
    type: "tea",
    category: "both",
    description: "Black tea flavored with bergamot citrus for aroma and mood support.",
    traditionalUse: "European aromatic tea for afternoon calm alertness.",
    mechanism: "Bergamot flavonoids and black tea polyphenols support mood and heart health.",
    benefits: ["Mood support", "Heart health", "Antioxidant support"],
    dosage: "1-3 cups daily.",
    timing: "Afternoon.",
    timeframe: "4-8 weeks for mood and cardiovascular support.",
    evidence: "moderate",
    evidenceSources: [
      {
        title: "Earl Grey Benefits - WebMD",
        url: "https://www.webmd.com/diet/earl-grey-tea-is-it-good-for-you",
        note: "Bergamot flavonoids and health considerations."
      }
    ],
    foodSources: ["Earl Grey tea"],
    cautions: ["Contains caffeine"],
    drugInteractions: ["Stimulants (additive caffeine)"],
    avoidIf: ["Severe caffeine sensitivity"],
    cycleTiming: "Can be used continuously.",
    synergies: ["L-Theanine", "Citrus"],
    conflicts: ["Excess caffeine intake"],
    systems: ["cardiovascular", "nervous"],
    goals: ["mood", "heart-health", "antioxidant", "focus"]
  },
  {
    id: "jasmine-green-tea",
    name: "Jasmine Green Tea (Camellia sinensis)",
    type: "tea",
    category: "traditional",
    description: "Green tea scented with jasmine blossoms for calming aroma.",
    traditionalUse: "Chinese tea for relaxation and gentle focus.",
    mechanism: "Green tea polyphenols plus aroma-linked calming effects.",
    benefits: ["Stress relief", "Antioxidant support", "Gentle focus"],
    dosage: "2-3 cups daily.",
    timing: "Late afternoon or evening.",
    timeframe: "2-4 weeks for stress support.",
    evidence: "limited",
    evidenceSources: [
      {
        title: "Jasmine Tea Benefits - WebMD",
        url: "https://www.webmd.com/diet/health-benefits-jasmine-tea",
        note: "Calming and antioxidant overview."
      }
    ],
    foodSources: ["Jasmine green tea"],
    cautions: ["Contains caffeine"],
    drugInteractions: ["Stimulants (additive caffeine)"],
    avoidIf: ["Severe caffeine sensitivity"],
    cycleTiming: "Use as desired.",
    synergies: ["L-Theanine", "Chamomile"],
    conflicts: ["Excess caffeine intake"],
    systems: ["nervous", "metabolic"],
    goals: ["stress", "antioxidant", "focus"]
  },
  {
    id: "decaf-tea",
    name: "Decaf Tea (Camellia sinensis)",
    type: "tea",
    category: "both",
    description: "Caffeine-removed tea that retains some polyphenols for gentle antioxidant support.",
    traditionalUse: "Evening alternative for tea drinkers who avoid caffeine.",
    mechanism: "Polyphenols support antioxidant defenses without stimulating caffeine.",
    benefits: ["Antioxidant support", "Heart health support"],
    dosage: "2-4 cups daily.",
    timing: "Evening or any time.",
    timeframe: "4-12 weeks for cardiovascular support.",
    evidence: "moderate",
    evidenceSources: [
      {
        title: "Decaf Green Tea Extract - PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7996723",
        note: "Polyphenol effects and fat oxidation."
      },
      {
        title: "Tea - Harvard Nutrition Source",
        url: "https://nutritionsource.hsph.harvard.edu/food-features/tea",
        note: "Overview of tea polyphenols."
      }
    ],
    foodSources: ["Decaffeinated green or black tea"],
    cautions: ["Small residual caffeine may remain"],
    drugInteractions: ["Stimulants (minimal but possible additive caffeine)"],
    avoidIf: ["Severe caffeine sensitivity (check decaf processing)"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Chamomile", "Lemon Verbena"],
    conflicts: [],
    systems: ["cardiovascular", "metabolic"],
    goals: ["heart-health", "antioxidant", "metabolism"]
  },
  // ============ VITAMINS ============
  {
    id: "vitamin-a",
    name: "Vitamin A (Retinol)",
    type: "vitamin",
    category: "modern",
    description: "Essential fat-soluble vitamin for vision, immune defense, and skin integrity. Retinol is preformed vitamin A; beta-carotene is a safer plant precursor.",
    traditionalUse: "Traditionally obtained from liver, egg yolks, and butter; plant sources provide beta-carotene.",
    benefits: ["Supports night vision", "Immune defense", "Skin and mucosal health", "Cell growth and repair"],
    dosage: "700-900mcg RAE daily. Avoid chronic intakes above 3000mcg RAE from retinol.",
    timing: "With a meal containing fat for absorption",
    timeframe: "Vision and immune support within weeks if deficient; skin benefits over 4-8 weeks.",
    evidence: "strong",
    foodSources: ["Liver", "Egg yolks", "Dairy", "Carrots", "Sweet potatoes", "Spinach"],
    cautions: ["High-dose retinol can be toxic", "Beta-carotene is safer for long-term use"],
    drugInteractions: ["Retinoid medications", "Blood thinners"],
    avoidIf: ["Pregnancy (avoid high-dose retinol)", "Liver disease (consult clinician)"],
    cycleTiming: "Use continuously at RDA levels if needed.",
    synergies: ["Zinc", "Vitamin D", "Dietary fat"],
    conflicts: [],
    systems: ["immune", "skin", "eyes"],
    goals: ["immunity", "skin", "eyes", "vision", "longevity"]
  },
  {
    id: "vitamin-b1",
    name: "Vitamin B1 (Thiamine)",
    type: "vitamin",
    category: "modern",
    description: "Key cofactor for carbohydrate metabolism and nervous system function. Deficiency can impair energy and cognition.",
    traditionalUse: "Obtained from whole grains, legumes, and pork.",
    benefits: ["Energy production", "Nervous system support", "Carbohydrate metabolism", "Heart health"],
    dosage: "1.1-1.2mg daily (RDA); 50-100mg often used in supplements.",
    timing: "Morning with food",
    timeframe: "Energy support within 1-2 weeks if deficient.",
    evidence: "strong",
    foodSources: ["Pork", "Whole grains", "Beans", "Seeds", "Nutritional yeast"],
    cautions: ["Generally very safe", "Excess is excreted in urine"],
    drugInteractions: ["Diuretics", "Certain antibiotics"],
    avoidIf: ["Generally safe for all"],
    cycleTiming: "Used continuously.",
    synergies: ["Other B vitamins", "Magnesium"],
    conflicts: [],
    systems: ["nervous", "energy", "cardiovascular"],
    goals: ["energy", "focus", "heart-health", "metabolism"]
  },
  {
    id: "vitamin-d3",
    name: "Vitamin D3 (Cholecalciferol)",
    type: "vitamin",
    category: "modern",
    description: 'The "sunshine vitamin" - actually a hormone. Deficiency is common and linked to bone and immune issues. Supplementation beyond the RDA is best targeted to deficiency or risk.',
    traditionalUse: "N/A - modern understanding. Traditionally obtained through sun exposure and fatty fish.",
    mechanism: "Acts as a hormone that regulates calcium balance, immune signaling, and gene expression via vitamin D receptors.",
    benefits: ["Immune regulation", "Bone health", "Mood support", "Muscle function", "Reduces infection risk", "Hormone support"],
    dosage: "600-800 IU daily for most healthy adults; 1,000-2,000 IU daily to reach \xE2\u2030\xA530 ng/mL in many adults (higher doses only if deficient under clinician guidance)",
    timing: "With a meal containing fat. Pair with K2 when supplementing.",
    timeframe: "Blood levels rise over 2-3 months. Some feel better in 2-4 weeks.",
    evidence: "strong",
    bioavailabilityNote: "Take with fat for absorption; consider pairing with K2.",
    evidenceSources: [
      {
        title: "NIH ODS: Vitamin D Fact Sheet",
        url: "https://ods.od.nih.gov/factsheets/VitaminD-Consumer/",
        note: "Covers dosing, deficiency, and safety ranges."
      }
    ],
    foodSources: ["Fatty fish (salmon, mackerel)", "Egg yolks", "Fortified foods", "Cod liver oil"],
    cautions: ["Avoid routine high-dose supplementation without clear risk or deficiency", "Can cause toxicity if overdone", "UL often ~4,000 IU/day unless clinician-directed"],
    drugInteractions: ["Thiazide diuretics", "Steroids", "Weight loss drugs", "Seizure medications"],
    avoidIf: ["Hypercalcemia", "Kidney disease", "Sarcoidosis"],
    cycleTiming: "Use continuously if deficient or at risk; otherwise consider food/sun exposure first.",
    synergies: ["Vitamin K2 (essential partner)", "Magnesium", "Zinc"],
    conflicts: ["Take separately from thyroid medication"],
    systems: ["immune", "skeletal", "endocrine", "nervous"],
    goals: ["immunity", "bone-health", "mood", "depression", "muscle", "hormonal-balance", "vitamin-d"]
  },
  {
    id: "vitamin-b12",
    name: "Vitamin B12 (Methylcobalamin)",
    type: "vitamin",
    category: "modern",
    description: "Essential for energy, brain function, and blood cell formation. Methylcobalamin is active form. Common deficiency, especially in vegetarians/vegans.",
    traditionalUse: "N/A - modern understanding. Traditionally obtained from animal foods.",
    mechanism: "Supports methylation cycles and red blood cell formation while protecting nerve myelin.",
    benefits: ["Increases energy", "Supports brain function", "Red blood cell formation", "Nerve health", "Methylation support", "Mood"],
    dosage: "1000-5000mcg methylcobalamin daily (higher if deficient)",
    timing: "Morning (can be energizing). Sublingual for best absorption.",
    timeframe: "Energy effects 1-2 weeks if deficient. Nerve repair longer.",
    evidence: "strong",
    evidenceSources: [
      {
        title: "NIH ODS: Vitamin B12 Fact Sheet",
        url: "https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/",
        note: "Deficiency, dosing, and safety guidance."
      }
    ],
    foodSources: ["Meat", "Fish", "Eggs", "Dairy", "Nutritional yeast (fortified)"],
    cautions: ["Very safe even at high doses", "Cyanocobalamin less effective than methylcobalamin"],
    drugInteractions: ["Metformin (depletes B12)", "Acid-reducing drugs"],
    avoidIf: ["Generally safe for everyone"],
    cycleTiming: "Used continuously.",
    synergies: ["Folate", "B6", "Other B vitamins"],
    conflicts: [],
    systems: ["nervous", "energy", "blood"],
    goals: ["energy", "brain-health", "nerve-health", "mood", "vegan", "vegetarian", "fatigue"]
  },
  {
    id: "vitamin-c",
    name: "Vitamin C (Ascorbic Acid)",
    type: "vitamin",
    category: "modern",
    description: "Essential antioxidant and immune supporter. Humans cannot produce it unlike most animals. Supports collagen, iron absorption, and more.",
    traditionalUse: "N/A - understood through scurvy prevention history. Obtained from fruits and vegetables.",
    benefits: ["Immune support", "Powerful antioxidant", "Collagen synthesis", "Iron absorption", "Reduces cold duration", "Skin health"],
    dosage: "500-2000mg daily (more during illness, divided doses)",
    timing: "Divided doses throughout day for best absorption",
    timeframe: "Immune support ongoing. Skin effects over weeks.",
    evidence: "strong",
    foodSources: ["Citrus fruits", "Bell peppers", "Kiwi", "Strawberries", "Broccoli", "Tomatoes"],
    cautions: ["High doses may cause GI upset or diarrhea", "Kidney stone risk with very high doses in susceptible individuals"],
    drugInteractions: ["May affect some chemotherapy drugs", "Increases iron absorption"],
    avoidIf: ["Hemochromatosis (iron overload)", "History of kidney stones (high doses)"],
    cycleTiming: "Used continuously.",
    synergies: ["Vitamin E", "Zinc", "Iron (enhances absorption)", "Collagen"],
    conflicts: ["May interfere with some blood tests"],
    systems: ["immune", "skin", "connective-tissue"],
    goals: ["immunity", "antioxidant", "skin", "collagen", "cold", "iron-absorption"]
  },
  {
    id: "vitamin-k2",
    name: "Vitamin K2 (MK-7)",
    type: "vitamin",
    category: "modern",
    description: "Directs calcium to bones and away from arteries. Essential partner to vitamin D. MK-7 form has longest half-life.",
    traditionalUse: "N/A - modern understanding. Traditionally from fermented foods and animal fats.",
    benefits: ["Bone strength", "Prevents arterial calcification", "Cardiovascular protection", "Dental health", "Synergizes with D3"],
    dosage: "100-200mcg MK-7 form daily",
    timing: "With vitamin D and fatty food",
    timeframe: "Effects on calcium metabolism ongoing. Bone/arterial effects over months to years.",
    evidence: "strong",
    foodSources: ["Natto (highest source)", "Hard cheeses", "Egg yolks", "Liver", "Butter from grass-fed cows"],
    cautions: ["K2 does not affect blood clotting like K1"],
    drugInteractions: ["Warfarin and similar anticoagulants"],
    avoidIf: ["On warfarin or similar blood thinners (consult doctor)"],
    cycleTiming: "Used continuously alongside vitamin D.",
    synergies: ["Vitamin D3 (essential combo)", "Calcium", "Magnesium"],
    conflicts: ["Warfarin (affects vitamin K metabolism)"],
    systems: ["skeletal", "cardiovascular"],
    goals: ["bone-health", "cardiovascular", "calcium", "arterial-health", "teeth"]
  },
  {
    id: "biotin",
    name: "Biotin (Vitamin B7)",
    type: "vitamin",
    category: "modern",
    description: "The most searched supplement for hair, skin, and nails. Essential for keratin production. High-dose biotin can distort lab tests.",
    topLevelSafetyAlert: "CRITICAL: Biotin interferes with many immunoassays (including troponin and thyroid tests) and can cause false results. Stop 5-7 days before labs and tell your clinician.",
    traditionalUse: "Found in egg yolks (cooked). Raw egg whites bind biotin and cause deficiency.",
    benefits: ["Hair thickness (if deficient)", "Nail strength", "Skin health", "Metabolism of fats/carbs"],
    dosage: "2-5mg (2000-5000mcg) daily",
    timing: "With food",
    timeframe: "Nail changes 3-6 months. Hair changes 4-8 months.",
    evidence: "limited",
    foodSources: ["Egg yolks (cooked)", "Liver", "Salmon", "Avocado", "Seeds"],
    cautions: ["CRITICAL: Interferes with 30+ lab tests including troponin, thyroid panels, tumor markers, and hormone assays; can cause false results"],
    drugInteractions: ["Anticonvulsants"],
    avoidIf: ["Stop 5-7 days before ANY blood work and notify your clinician"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Collagen", "Zinc", "Silica"],
    conflicts: ["Raw egg whites (Avidin blocks absorption)"],
    systems: ["skin", "metabolic"],
    goals: ["hair-loss", "nails", "skin", "beauty"]
  },
  {
    id: "vitamin-e",
    name: "Vitamin E",
    type: "vitamin",
    category: "modern",
    description: "Fat-soluble antioxidant that protects cell membranes from oxidative damage. Mixed tocopherols are preferred for general use.",
    traditionalUse: "Obtained from nuts, seeds, and plant oils.",
    benefits: ["Antioxidant protection", "Skin health", "Immune support", "Cardiovascular support"],
    dosage: "100-400 IU daily of mixed tocopherols",
    timing: "With a meal containing fat",
    timeframe: "Antioxidant effects ongoing; skin benefits over 4-8 weeks.",
    evidence: "moderate",
    foodSources: ["Almonds", "Sunflower seeds", "Wheat germ oil", "Avocado", "Spinach"],
    cautions: ["High doses may increase bleeding risk"],
    drugInteractions: ["Blood thinners", "Chemotherapy"],
    avoidIf: ["Bleeding disorders", "Before surgery"],
    cycleTiming: "Use continuously at moderate doses.",
    synergies: ["Vitamin C", "Selenium", "Omega-3"],
    conflicts: ["Vitamin K2 (high-dose E may interfere)"],
    systems: ["cardiovascular", "immune", "skin"],
    goals: ["antioxidant", "skin", "heart-health", "immunity"]
  },
  {
    id: "vitamin-e-tocotrienol",
    name: "Vitamin E (Tocotrienols)",
    type: "vitamin",
    category: "modern",
    description: "The superior form of Vitamin E (found in Annatto). 50x stronger antioxidant than common Tocopherols. Neuroprotective.",
    traditionalUse: "N/A - modern extraction.",
    benefits: ["Neuroprotection", "Liver health (Fatty liver)", "Cholesterol support", "Arterial health", "Powerful antioxidant"],
    dosage: "100-200mg Tocotrienols (look for Delta/Gamma fraction)",
    timing: "Evening with dinner",
    timeframe: "Antioxidant effects immediate. Liver effects 3 months.",
    evidence: "strong",
    foodSources: ["Annatto seeds", "Palm oil", "Rice bran oil"],
    cautions: ["Blood thinning effects"],
    drugInteractions: ["Blood thinners (Warfarin)"],
    avoidIf: ["Before surgery"],
    cycleTiming: "Continuous.",
    synergies: ["CoQ10", "Vitamin C", "Selenium"],
    conflicts: ["Alpha-Tocopherol (common Vitamin E) can block Tocotrienol absorption - take 6 hours apart"],
    systems: ["nervous", "hepatic", "cardiovascular"],
    goals: ["liver", "brain-health", "cholesterol", "arteries", "antioxidant"]
  },
  {
    id: "b-complex",
    name: "Vitamin B Complex",
    type: "vitamin",
    category: "modern",
    description: "All 8 B vitamins working synergistically for energy, nervous system, and metabolism. Look for methylated forms (methylfolate, methylcobalamin).",
    traditionalUse: "N/A - modern understanding. Traditionally from whole grains, meat, and vegetables.",
    benefits: ["Energy production", "Nervous system support", "Stress support", "Methylation", "Brain function", "Mood"],
    dosage: "B-50 or B-100 complex daily",
    timing: "Morning with food (B vitamins can be energizing)",
    timeframe: "Energy support within 1-2 weeks.",
    evidence: "strong",
    foodSources: ["Whole grains", "Meat", "Eggs", "Legumes", "Leafy greens", "Nutritional yeast"],
    cautions: ["May cause bright yellow urine (normal - riboflavin)", "High B6 (pyridoxine HCl) can cause nerve issues long-term; prefer P-5-P (pyridoxal-5-phosphate)"],
    drugInteractions: ["Some antibiotics", "Seizure medications", "Methotrexate"],
    avoidIf: ["Generally safe for most"],
    cycleTiming: "Used continuously.",
    synergies: ["Works well with most supplements", "Supports energy supplements"],
    conflicts: [],
    systems: ["nervous", "energy", "metabolic"],
    goals: ["energy", "stress", "mood", "nervous-system", "brain-health", "metabolism"]
  },
  {
    id: "folate",
    name: "Folate (L-Methylfolate / 5-MTHF)",
    type: "vitamin",
    category: "modern",
    description: "Active form of vitamin B9 that supports DNA synthesis, neurotransmitter production, and methylation. Standard guidance still emphasizes folic acid 400 mcg daily; methylfolate is an alternative when tolerated or clinician-advised.",
    traditionalUse: 'N/A - modern understanding. Found in leafy greens ("foliage").',
    benefits: ["Neurotransmitter production", "DNA synthesis", "Pregnancy health", "Mood support", "Methylation", "Cardiovascular"],
    dosage: "400-800mcg daily (folic acid or methylfolate). High-risk cases may need 4-5mg under clinician guidance.",
    timing: "Any time",
    timeframe: "Supports ongoing cellular function. Mood effects 4-8 weeks.",
    evidence: "strong",
    foodSources: ["Leafy greens", "Legumes", "Asparagus", "Broccoli", "Liver"],
    cautions: ["May mask B12 deficiency at high doses", "High-dose folate should be clinician-guided (e.g., prior NTD)", "Folic acid UL is 1000mcg/day unless supervised"],
    drugInteractions: ["Methotrexate", "Seizure medications", "Some antibiotics"],
    avoidIf: ["Generally safe. Consult doctor if on methotrexate or seizure medications."],
    cycleTiming: "Used continuously.",
    synergies: ["B12", "B6", "SAMe"],
    conflicts: [],
    systems: ["nervous", "blood", "cellular"],
    goals: ["mood", "pregnancy", "methylation", "homocysteine", "brain-health"]
  },
  // ============ MINERALS ============
  {
    id: "magnesium",
    name: "Magnesium",
    type: "mineral",
    category: "modern",
    description: "Involved in 300+ enzymatic reactions. Widespread deficiency due to depleted soils. Benefits are strongest when deficient or under stress.",
    traditionalUse: "N/A - modern understanding. Historically obtained from mineral-rich foods and water.",
    mechanism: "Supports ATP production and neuromuscular relaxation by regulating calcium channels and NMDA activity.",
    benefits: ["Muscle relaxation", "Sleep quality", "Stress reduction", "Blood pressure", "Blood sugar", "Migraine prevention", "Energy production"],
    dosage: "300-400mg elemental magnesium daily. Glycinate for calm/sleep, Citrate for bowels, Threonate for brain, Malate for energy.",
    timing: "Evening for sleep benefits. Can split doses.",
    timeframe: "Sleep/relaxation effects within days. Full repletion takes 4-12 weeks.",
    evidence: "strong",
    evidenceSources: [
      {
        title: "NIH ODS: Magnesium Fact Sheet",
        url: "https://ods.od.nih.gov/factsheets/Magnesium-Consumer/",
        note: "Dietary sources, dosing, and safety."
      }
    ],
    foodSources: ["Dark chocolate", "Avocados", "Nuts", "Seeds", "Leafy greens", "Legumes"],
    cautions: ["Too much can cause loose stools (esp. citrate, oxide)"],
    drugInteractions: ["Antibiotics (take separately)", "Bisphosphonates", "Diuretics", "Heart medications"],
    avoidIf: ["Severe kidney disease (consult doctor)"],
    cycleTiming: "Used continuously.",
    synergies: ["Vitamin D (needed for absorption)", "Vitamin B6", "Calcium (balance)"],
    conflicts: ["Take separately from antibiotics and some medications"],
    systems: ["nervous", "muscular", "cardiovascular", "metabolic"],
    goals: ["sleep", "stress", "anxiety", "muscle-cramps", "blood-pressure", "migraine", "energy", "relaxation"]
  },
  {
    id: "zinc",
    name: "Zinc",
    type: "mineral",
    category: "modern",
    description: "Essential for immune function, testosterone synthesis, semen volume, and hundreds of enzymes. Deficiency is common worldwide.",
    traditionalUse: "N/A - modern understanding. Found in oysters, meat, and seeds.",
    mechanism: "Cofactor for immune signaling, antioxidant enzymes, and hormone metabolism.",
    benefits: ["Immune function", "Testosterone support", "Semen volume support", "Sperm motility support", "Wound healing", "Reduces cold duration", "Skin health", "Taste/smell"],
    dosage: "15-30mg elemental zinc daily (picolinate or glycinate)",
    timing: "With food to prevent nausea. Evening can help with testosterone and sleep.",
    timeframe: "Immune effects ongoing. Cold reduction if taken early.",
    evidence: "strong",
    evidenceSources: [
      {
        title: "NIH ODS: Zinc Fact Sheet",
        url: "https://ods.od.nih.gov/factsheets/Zinc-Consumer/",
        note: "Evidence, dosing limits, and interactions."
      }
    ],
    foodSources: ["Oysters (highest)", "Beef", "Pumpkin seeds", "Chickpeas", "Cashews", "Eggs"],
    cautions: ["Do not exceed 40mg daily long-term", "Can deplete copper if taken long-term", "MUST balance with Copper if taking >30mg daily long-term (15mg Zinc : 1mg Copper ratio)."],
    drugInteractions: ["Antibiotics (take separately)", "Diuretics", "Penicillamine"],
    avoidIf: ["Generally safe at recommended doses"],
    cycleTiming: "Used continuously. If taking long-term, ensure copper intake.",
    synergies: ["Copper", "Vitamin C", "Vitamin A"],
    conflicts: ["Take separately from iron and calcium (compete for absorption)", "Antibiotics"],
    systems: ["immune", "reproductive", "skin", "metabolic"],
    goals: ["immunity", "testosterone", "skin", "wound-healing", "cold", "acne", "libido", "fertility", "sexual-health", "sperm-quality", "sperm-motility", "semen-volume"]
  },
  {
    id: "copper",
    name: "Copper",
    type: "mineral",
    category: "modern",
    description: "Trace mineral essential for collagen elasticity, iron transport, and energy. Must be balanced with Zinc.",
    traditionalUse: "Found in liver and shellfish.",
    benefits: ["Prevents grey hair (pigmentation)", "Collagen synthesis", "Iron metabolism", "Energy production", "Nerve signaling"],
    dosage: "1-2mg daily (Maintain 1:15 ratio with Zinc)",
    timing: "With food (away from high Zinc dose if possible, though combined is okay for maintenance)",
    timeframe: "Levels restore over 4-8 weeks.",
    evidence: "strong",
    foodSources: ["Beef liver", "Oysters", "Shiitake mushrooms", "Dark chocolate", "Cashews"],
    cautions: ["Toxic in excess", "Zinc supplements deplete copper"],
    drugInteractions: ["Birth control pills (increase copper)", "NSAIDs"],
    avoidIf: ["Wilson's Disease (copper accumulation disorder)"],
    cycleTiming: "Continuous if taking Zinc.",
    synergies: ["Zinc (in balance)", "Iron"],
    conflicts: ["High dose Zinc (depletes copper)", "High dose Vitamin C (decreases absorption)"],
    systems: ["connective-tissue", "blood", "energy", "skin"],
    goals: ["grey-hair", "skin", "energy", "anemia", "collagen"]
  },
  {
    id: "boron",
    name: "Boron",
    type: "mineral",
    category: "modern",
    description: "Trace mineral essential for bone density and hormonal balance. Known to lower SHBG, thereby increasing free testosterone.",
    traditionalUse: "Naturally found in raisins, prunes, and nuts.",
    benefits: ["Increases free testosterone", "Lowers SHBG", "Bone density", "Reduces inflammation", "Cognitive performance", "Magnesium absorption"],
    dosage: "3-10mg daily",
    timing: "Morning or evening with food",
    timeframe: "Hormonal effects within 1-4 weeks.",
    evidence: "strong",
    foodSources: ["Raisins", "Prunes", "Avocados", "Almonds"],
    cautions: ["None at recommended doses", "High doses (20mg+) not recommended long term"],
    drugInteractions: ["Estrogen-containing drugs"],
    avoidIf: ["Hormone-sensitive conditions (due to estrogen increase potential)"],
    cycleTiming: "Cycle 2 weeks on, 1 week off recommended.",
    synergies: ["Magnesium", "Vitamin D3", "Testosterone boosters"],
    conflicts: [],
    systems: ["skeletal", "endocrine", "cognitive"],
    goals: ["testosterone", "bone-health", "libido", "inflammation", "joints"]
  },
  {
    id: "selenium",
    name: "Selenium",
    type: "mineral",
    category: "modern",
    description: "Critical for thyroid function, immune system, antioxidant enzymes, and seminal antioxidant defense. Brazil nuts are the richest food source.",
    traditionalUse: "N/A - modern understanding.",
    benefits: ["Thyroid conversion (T4 to T3)", "Immune function", "Antioxidant enzymes", "Sperm motility support", "Fertility"],
    dosage: "100-200mcg daily",
    timing: "With food",
    timeframe: "Supports ongoing thyroid and immune function.",
    evidence: "strong",
    foodSources: ["Brazil nuts (2 nuts = daily need)", "Fish", "Meat", "Eggs", "Sunflower seeds"],
    cautions: ["Toxicity possible over 400mcg/day", "Garlic breath at high doses"],
    drugInteractions: ["Blood thinners", "Cholesterol medications", "Chemotherapy drugs"],
    avoidIf: ["Skin cancer history (high doses may be problematic)"],
    cycleTiming: "Used continuously at safe doses.",
    synergies: ["Vitamin E", "Zinc", "Iodine (for thyroid)"],
    conflicts: [],
    systems: ["thyroid", "immune", "reproductive"],
    goals: ["thyroid", "immunity", "antioxidant", "fertility", "sexual-health", "sperm-quality", "sperm-motility", "cancer-prevention"]
  },
  {
    id: "chromium",
    name: "Chromium",
    type: "mineral",
    category: "modern",
    description: "Trace mineral that supports insulin signaling and blood sugar regulation. Chromium picolinate is the most common supplemental form.",
    traditionalUse: "Obtained from whole grains, meats, and vegetables.",
    benefits: ["Supports blood sugar balance", "Improves insulin sensitivity", "May reduce carb cravings"],
    dosage: "200-400mcg daily",
    timing: "With meals",
    timeframe: "Blood sugar effects 4-8 weeks.",
    evidence: "moderate",
    foodSources: ["Broccoli", "Whole grains", "Meat", "Egg yolks"],
    cautions: ["Monitor blood sugar if diabetic"],
    drugInteractions: ["Insulin", "Diabetes medications"],
    avoidIf: ["Kidney disease (high-dose caution)"],
    cycleTiming: "Used continuously if needed.",
    synergies: ["Magnesium", "Fiber", "Alpha Lipoic Acid"],
    conflicts: [],
    systems: ["metabolic", "endocrine"],
    goals: ["blood-sugar", "weight", "energy", "metabolism"]
  },
  {
    id: "iodine",
    name: "Iodine (Potassium Iodide/Kelp)",
    type: "mineral",
    category: "modern",
    description: 'Essential fuel for the thyroid. Deficiency common in those who avoid iodized salt or eat "clean" (sea salt lacks iodine).',
    traditionalUse: "Seaweed consumed in coastal cultures.",
    benefits: ["Thyroid hormone production", "Metabolism regulation", "Fibrocystic breast support", "Detoxification (halogens)", "Cognitive development"],
    dosage: "150-250mcg daily (250mcg in pregnancy); higher doses only with clinician supervision",
    timing: "Morning",
    timeframe: "Thyroid uptake immediate. Metabolic effects 4-8 weeks.",
    evidence: "strong",
    foodSources: ["Seaweed (Kelp, Nori, Wakame)", "Cod", "Dairy", "Iodized salt"],
    cautions: ["Can trigger Hashimoto's flare-ups", "Avoid excessive intake (>500mcg/day) unless supervised", "Pair with adequate Selenium"],
    drugInteractions: ["Thyroid medications", "Lithium", "Diuretics"],
    avoidIf: ["Hashimoto's Thyroiditis (unless supervised)", "Hyperthyroidism"],
    cycleTiming: "Continuous (RDA levels).",
    synergies: ["Selenium (CRITICAL partner)", "Tyrosine"],
    conflicts: [],
    systems: ["thyroid", "metabolic", "reproductive"],
    goals: ["thyroid", "energy", "metabolism", "breast-health", "detox"]
  },
  {
    id: "iron",
    name: "Iron (Ferrous Bisglycinate)",
    type: "mineral",
    category: "modern",
    description: "Essential for oxygen transport and energy. Common deficiency, especially in women. Bisglycinate form is gentle on stomach.",
    traditionalUse: "N/A - modern understanding. Found in red meat and leafy greens.",
    mechanism: "Core component of hemoglobin and myoglobin, enabling oxygen transport and mitochondrial energy production.",
    benefits: ["Combats fatigue", "Oxygen transport", "Energy production", "Cognitive function", "Restless leg support"],
    dosage: "18mg daily (RDA). 45-60mg daily only if deficient (test ferritin first); higher therapeutic doses (60-120mg) require clinician guidance",
    timing: "Morning on empty stomach with vitamin C. Take separately from calcium and coffee/tea.",
    timeframe: "Energy improvement 2-4 weeks if deficient. Full repletion 3-6 months.",
    evidence: "strong",
    evidenceSources: [
      {
        title: "NIH ODS: Iron Fact Sheet",
        url: "https://ods.od.nih.gov/factsheets/Iron-Consumer/",
        note: "Deficiency signs, dosing guidance, and safety."
      }
    ],
    foodSources: ["Red meat", "Organ meats", "Spinach", "Legumes", "Fortified cereals"],
    cautions: ["Test ferritin levels before supplementing", "Excess iron is harmful and pro-oxidant", "High doses can cause constipation or GI upset"],
    drugInteractions: ["Many medications - take separately", "Thyroid medications", "Bisphosphonates"],
    avoidIf: ["Men and postmenopausal women unless deficient", "Hemochromatosis", "Thalassemia"],
    cycleTiming: "Only use to correct deficiency. Stop when ferritin normalized.",
    synergies: ["Vitamin C (enhances absorption 6x)", "B12", "Folate"],
    conflicts: ["Calcium (take separately)", "Coffee/tea (inhibit absorption)", "Zinc (take separately)"],
    systems: ["blood", "energy"],
    goals: ["fatigue", "energy", "anemia", "restless-leg", "iron-deficiency"]
  },
  {
    id: "calcium",
    name: "Calcium",
    type: "mineral",
    category: "modern",
    description: "Primary mineral for bone structure. Best from food; supplements controversial. Always combine with D3, K2, and magnesium.",
    traditionalUse: "N/A - modern understanding. Historically from dairy, bones, and leafy greens.",
    benefits: ["Bone strength", "Muscle function", "Nerve signaling", "Blood clotting", "Heart rhythm"],
    dosage: "500-600mg calcium citrate if needed (aim for 1000-1200mg total from diet + supplements)",
    timing: "Divided doses with food. Take separately from iron and thyroid medications.",
    timeframe: "Bone effects long-term (years).",
    evidence: "strong",
    foodSources: ["Dairy", "Sardines with bones", "Fortified plant milks", "Leafy greens", "Tofu"],
    cautions: ["Don't exceed 1200mg daily total", "Without K2 and D3, may calcify arteries"],
    drugInteractions: ["Thyroid medications", "Bisphosphonates", "Some antibiotics", "Iron"],
    avoidIf: ["Hypercalcemia", "Kidney stones (consult doctor)", "Hyperparathyroidism"],
    cycleTiming: "Used continuously with D3 and K2.",
    synergies: ["Vitamin D3 (essential)", "Vitamin K2 (essential)", "Magnesium (essential balance)"],
    conflicts: ["Iron", "Zinc", "Thyroid medications"],
    systems: ["skeletal", "muscular", "nervous"],
    goals: ["bone-health", "osteoporosis", "muscle-function"]
  },
  {
    id: "potassium",
    name: "Potassium",
    type: "mineral",
    category: "modern",
    description: "Essential electrolyte for blood pressure, heart rhythm, and muscle function. Most people don't get enough from diet.",
    traditionalUse: "N/A - modern understanding. Found in fruits, vegetables, and legumes.",
    benefits: ["Blood pressure reduction", "Heart rhythm", "Muscle function", "Sodium balance", "Cramp prevention"],
    dosage: "Focus on food sources. Supplements limited to 99mg per pill. Potassium chloride or citrate.",
    timing: "With meals to reduce GI upset",
    timeframe: "Blood pressure effects 2-4 weeks.",
    evidence: "strong",
    foodSources: ["Bananas", "Potatoes", "Sweet potatoes", "Spinach", "Beans", "Avocados", "Salmon"],
    cautions: ["Supplement doses above 99mg require prescription for safety"],
    drugInteractions: ["ACE inhibitors", "ARBs", "Potassium-sparing diuretics", "NSAIDs"],
    avoidIf: ["Kidney disease", "Taking potassium-sparing medications", "Adrenal insufficiency"],
    cycleTiming: "Used continuously if needed.",
    synergies: ["Magnesium"],
    conflicts: ["Certain blood pressure medications"],
    systems: ["cardiovascular", "muscular"],
    goals: ["blood-pressure", "heart-health", "cramps", "electrolytes"]
  },
  // ============ AMINO ACIDS ============
  {
    id: "l-theanine",
    name: "L-Theanine",
    type: "amino-acid",
    category: "modern",
    description: "Amino acid from green tea that promotes alpha brain waves and relaxation without sedation. Synergizes with caffeine for focused calm.",
    traditionalUse: "Consumed through green tea for centuries in Asian cultures.",
    benefits: ["Promotes calm focus", "Reduces anxiety", "Improves sleep quality", "Enhances alpha brain waves", "Synergizes with caffeine", "Reduces jitters"],
    dosage: "100-400mg daily",
    timing: "Any time. With caffeine for focus. Before bed for sleep.",
    timeframe: "Effects within 30-40 minutes.",
    evidence: "strong",
    foodSources: ["Green tea", "Black tea (lower amounts)"],
    cautions: ["Very safe. May lower blood pressure slightly."],
    drugInteractions: ["Blood pressure medications (may enhance)"],
    avoidIf: ["Low blood pressure (use cautiously)"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Caffeine (classic combo)", "Magnesium", "GABA", "Ashwagandha"],
    conflicts: [],
    systems: ["nervous"],
    goals: ["anxiety", "focus", "calm", "sleep", "stress", "caffeine-jitters"]
  },
  {
    id: "gaba",
    name: "GABA (Gamma-Aminobutyric Acid)",
    type: "amino-acid",
    category: "modern",
    description: "Primary inhibitory neurotransmitter for relaxation and sleep. Supplemental GABA may help calm the nervous system in some people.",
    traditionalUse: "N/A - endogenous neurotransmitter.",
    benefits: ["Relaxation", "Sleep support", "Reduces nervous tension", "Stress relief"],
    dosage: "250-750mg daily",
    timing: "Evening or before bed",
    timeframe: "Calming effects within 30-60 minutes for some users.",
    evidence: "limited",
    foodSources: ["Fermented foods (small amounts)", "Tea (minor amounts)"],
    cautions: ["Effectiveness varies; may not cross blood-brain barrier well"],
    drugInteractions: ["Sedatives", "Blood pressure medications"],
    avoidIf: ["Pregnancy (lack of data)"],
    cycleTiming: "Use as needed or in short cycles.",
    synergies: ["L-Theanine", "Magnesium", "Taurine"],
    conflicts: ["Other sedatives (additive effects)"],
    systems: ["nervous"],
    goals: ["sleep", "stress", "calm", "anxiety"]
  },
  {
    id: "glycine",
    name: "Glycine",
    type: "amino-acid",
    category: "modern",
    description: "Simple amino acid that promotes sleep, supports collagen, and is a glutathione precursor. Lowers body temperature for sleep.",
    traditionalUse: "Obtained through collagen-rich foods like bone broth.",
    benefits: ["Improves sleep quality", "Lowers core body temperature", "Collagen synthesis", "Glutathione precursor", "Next-day alertness", "Anti-aging"],
    dosage: "3-5g before bed",
    timing: "Before bed for sleep. Any time for other benefits.",
    timeframe: "Sleep effects within days.",
    evidence: "strong",
    foodSources: ["Bone broth", "Gelatin", "Collagen-rich foods", "Meat skin"],
    cautions: ["Very safe", "Slightly sweet taste"],
    drugInteractions: ["Clozapine (antipsychotic)"],
    avoidIf: ["Generally safe for all"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Magnesium", "NAC (for glutathione)", "Collagen"],
    conflicts: [],
    systems: ["nervous", "connective-tissue"],
    goals: ["sleep", "collagen", "anti-aging", "glutathione", "recovery"]
  },
  {
    id: "nac",
    name: "N-Acetyl Cysteine (NAC)",
    type: "amino-acid",
    category: "modern",
    description: "Precursor to glutathione - the master antioxidant. Supports liver, respiratory health, and mental health. Mucolytic properties.",
    traditionalUse: "N/A - modern development. Cysteine found in high-protein foods.",
    benefits: ["Glutathione production", "Liver detox", "Respiratory health", "Mental health support", "OCD/addiction support", "Heavy metal chelation"],
    dosage: "600-1800mg daily",
    timing: "On empty stomach for best absorption",
    timeframe: "Mucolytic effects within days. Glutathione support ongoing.",
    evidence: "strong",
    foodSources: ["High-protein foods contain cysteine", "Garlic", "Onions"],
    cautions: ["May cause GI upset", "Sulfur smell"],
    drugInteractions: ["Nitroglycerin", "Blood thinners", "Chemotherapy drugs"],
    avoidIf: ["Active bleeding ulcers"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Vitamin C", "Selenium", "Glycine (all glutathione precursors)"],
    conflicts: ["Take separately from some medications"],
    systems: ["hepatic", "respiratory", "nervous", "detox"],
    goals: ["liver", "detox", "glutathione", "respiratory", "mental-health", "ocd", "addiction"]
  },
  {
    id: "l-tyrosine",
    name: "L-Tyrosine",
    type: "amino-acid",
    category: "modern",
    description: "Precursor to dopamine, norepinephrine, and thyroid hormones. Supports focus and motivation under stress.",
    traditionalUse: "N/A - found naturally in protein-rich foods.",
    benefits: ["Dopamine precursor", "Enhances focus under stress", "Reduces stress effects", "Working memory", "Motivation", "Thyroid support"],
    dosage: "500-2000mg",
    timing: "Morning on empty stomach, 30 min before food",
    timeframe: "Effects within 30-60 minutes.",
    evidence: "strong",
    foodSources: ["Cheese", "Meat", "Fish", "Eggs", "Nuts", "Beans", "Oats"],
    cautions: ["May cause jitteriness or anxiety in high doses"],
    drugInteractions: ["MAOIs (dangerous)", "Thyroid medications", "Levodopa"],
    avoidIf: ["Hyperthyroidism", "Melanoma", "MAOIs"],
    cycleTiming: "Best used as needed for stressful periods, not daily long-term.",
    synergies: ["B6 (needed for conversion)", "Vitamin C", "Copper"],
    conflicts: ["MAOIs", "Too much caffeine"],
    systems: ["nervous", "endocrine"],
    goals: ["focus", "motivation", "stress", "dopamine", "thyroid", "cognitive"]
  },
  {
    id: "creatine",
    name: "Creatine Monohydrate",
    type: "amino-acid",
    category: "modern",
    description: "Most studied sports supplement. Increases ATP for strength and power. Also benefits brain function. Safe and effective.",
    traditionalUse: "N/A - found naturally in meat.",
    mechanism: "Replenishes phosphocreatine stores to regenerate ATP during high-intensity effort.",
    benefits: ["Increases strength 5-10%", "Enhances power output", "Supports muscle growth", "Brain energy", "Improves recovery", "Cognitive benefits"],
    dosage: "3-5g daily (loading optional: 20g/day split for 5-7 days for faster saturation)",
    dosagePerKg: { min: 0.03, max: 0.05, unit: "g", note: "Maintenance dosing based on body weight." },
    timing: "Any time, consistency matters most. Post-workout may be slightly better.",
    timeframe: "Strength effects 2-4 weeks. Brain effects ongoing.",
    evidence: "strong",
    evidenceSources: [
      {
        title: "ISSN Position Stand: Creatine Supplementation",
        url: "https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0173-z",
        note: "Comprehensive review of dosing, safety, and performance outcomes."
      }
    ],
    foodSources: ["Red meat", "Fish"],
    cautions: ["May cause water retention initially", "Stay hydrated", "Can raise creatinine lab marker without kidney injury"],
    drugInteractions: ["Nephrotoxic drugs (kidney concern)"],
    avoidIf: ["Pre-existing kidney disease (consult doctor)"],
    cycleTiming: "Can be used continuously. No need to cycle.",
    synergies: ["Carbohydrates (enhance uptake)", "Beta-alanine", "HMB"],
    conflicts: [],
    systems: ["muscular", "nervous", "energy"],
    goals: ["strength", "muscle", "power", "brain-health", "recovery", "athletic-performance", "cognitive"]
  },
  {
    id: "taurine",
    name: "Taurine",
    type: "amino-acid",
    category: "modern",
    description: "Calming amino acid concentrated in heart, brain, and muscles. Supports GABA, reduces excitatory glutamate, and acts as antioxidant.",
    traditionalUse: "N/A - found in meat and seafood.",
    benefits: ["Calms nervous system", "Heart health", "Reduces anxiety", "Sleep support", "Antioxidant", "Exercise performance"],
    dosage: "500-2000mg daily",
    timing: "Any time. Evening for calming/sleep benefits.",
    timeframe: "Calming effects within hours to days.",
    evidence: "moderate",
    foodSources: ["Meat", "Fish", "Shellfish", "Eggs"],
    cautions: ["Very safe", "Ironically calming despite being in energy drinks"],
    drugInteractions: ["Lithium"],
    avoidIf: ["Generally safe for all"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Magnesium", "L-Theanine", "GABA"],
    conflicts: [],
    systems: ["nervous", "cardiovascular", "muscular"],
    goals: ["calm", "sleep", "heart-health", "anxiety", "athletic-performance"]
  },
  {
    id: "acetyl-l-carnitine",
    name: "Acetyl-L-Carnitine (ALCAR)",
    type: "amino-acid",
    category: "modern",
    description: "Transports fatty acids into mitochondria for energy. Acetyl form crosses blood-brain barrier for cognitive benefits.",
    traditionalUse: "N/A - found in meat (especially red meat).",
    benefits: ["Fatty acid metabolism", "Mental energy", "Neuroprotective", "Exercise performance", "Anti-aging", "Mood support", "Sperm energy support"],
    dosage: "1-3g daily (split doses)",
    timing: "Morning on empty stomach (energizing)",
    timeframe: "Energy effects 1-2 weeks. Neuroprotective effects ongoing.",
    evidence: "strong",
    foodSources: ["Red meat", "Dairy", "Fish", "Chicken"],
    cautions: ["May cause fishy body odor in some", "Can be stimulating"],
    drugInteractions: ["Blood thinners", "Thyroid medications"],
    avoidIf: ["Seizure disorders (may lower seizure threshold)", "Hypothyroidism"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Alpha Lipoic Acid", "CoQ10", "B vitamins"],
    conflicts: [],
    systems: ["energy", "nervous", "cognitive"],
    goals: ["energy", "brain-health", "anti-aging", "fat-metabolism", "mood", "cognitive", "fertility"]
  },
  {
    id: "5-htp",
    name: "5-HTP (5-Hydroxytryptophan)",
    type: "amino-acid",
    category: "modern",
    description: "Direct precursor to serotonin. From Griffonia simplicifolia seeds. Supports mood, sleep, and appetite.",
    traditionalUse: "N/A - modern extraction from African plant.",
    benefits: ["Increases serotonin", "Mood support", "Sleep improvement", "Appetite reduction", "Anxiety relief", "Migraine prevention"],
    dosage: "50-200mg daily",
    timing: "Before bed for sleep. Divided doses for mood.",
    timeframe: "Sleep effects within days. Mood effects 2-4 weeks.",
    evidence: "moderate",
    foodSources: ["Not found in foods (extracted from Griffonia seeds)"],
    cautions: ["Can cause nausea", "Serotonin syndrome risk if combined with SSRIs"],
    drugInteractions: ["SSRIs (serotonin syndrome risk)", "MAOIs", "Triptans", "Tramadol"],
    avoidIf: ["On serotonergic medications", "Carcinoid tumors", "Scleroderma"],
    cycleTiming: "Best for short to medium-term use. Take breaks.",
    synergies: ["B6 (needed for conversion)", "EGCG from green tea (prevents peripheral conversion)"],
    conflicts: ["SSRIs", "MAOIs", "Other serotonergic substances"],
    systems: ["nervous"],
    goals: ["mood", "sleep", "depression", "anxiety", "appetite", "migraine"]
  },
  {
    id: "tryptophan",
    name: "L-Tryptophan",
    type: "amino-acid",
    category: "modern",
    description: "Essential amino acid precursor to serotonin and melatonin. Supports sleep and mood when taken before bed.",
    traditionalUse: "Obtained from protein-rich foods.",
    benefits: ["Sleep support", "Mood regulation", "Serotonin production", "Relaxation"],
    dosage: "500-1000mg before bed",
    timing: "Evening, away from high-protein meals",
    timeframe: "Sleep benefits within days.",
    evidence: "strong",
    foodSources: ["Turkey", "Eggs", "Cheese", "Seeds", "Tofu"],
    cautions: ["Similar precautions to 5-HTP"],
    drugInteractions: ["Antidepressants", "Sedatives", "MAOIs"],
    avoidIf: ["On serotonergic medications"],
    cycleTiming: "Use as needed or in short cycles.",
    synergies: ["Vitamin B6", "Magnesium", "Glycine"],
    conflicts: ["SSRIs", "MAOIs", "5-HTP"],
    systems: ["nervous"],
    goals: ["sleep", "mood", "stress", "relaxation"]
  },
  // ============ OTHER SUPPLEMENTS ============
  /** Source: STACKS_ALIGNMENT_RESEARCH_REPORT.md */
  {
    id: "coq10",
    name: "CoQ10 (Ubiquinol)",
    type: "other",
    category: "modern",
    description: "Essential coenzyme for mitochondrial ATP production and antioxidant defense. Ubiquinol is the active form and levels decline with age or statin use.",
    traditionalUse: "N/A - modern understanding. Found in organ meats.",
    benefits: ["Boosts cellular energy", "Heart health", "Powerful antioxidant", "Reduces statin side effects", "Anti-aging", "Migraine prevention", "Sperm motility support"],
    dosage: "200-300mg ubiquinol daily (up to 300mg for fertility or statin support)",
    timing: "Morning with fatty food for absorption",
    timeframe: "Energy effects 2-4 weeks. Heart benefits ongoing.",
    evidence: "strong",
    bioavailabilityNote: "Take with fat for absorption; ubiquinol is more bioavailable than ubiquinone.",
    foodSources: ["Organ meats", "Sardines", "Mackerel", "Peanuts", "Spinach"],
    cautions: ["Ubiquinol is better absorbed than ubiquinone, especially over age 40"],
    drugInteractions: ["Blood thinners", "Blood pressure medications", "Chemotherapy"],
    avoidIf: ["Generally safe. Consult doctor if on blood thinners."],
    cycleTiming: "Used continuously, especially if on statins.",
    synergies: ["Shilajit (enhances CoQ10)", "PQQ", "Magnesium"],
    conflicts: [],
    systems: ["energy", "cardiovascular", "reproductive"],
    goals: ["energy", "heart-health", "mitochondria", "statin-support", "anti-aging", "migraine", "fertility", "sexual-health", "sperm-motility"]
  },
  {
    id: "nmn",
    name: "NMN (Nicotinamide Mononucleotide)",
    type: "other",
    category: "modern",
    description: 'Direct precursor to NAD+. The "fuel" for sirtuins (longevity genes). Declines drastically with age.',
    traditionalUse: "Trace amounts in broccoli and avocado.",
    benefits: ["Boosts NAD+ levels", "DNA repair support", "Cellular energy", "Insulin sensitivity", "Anti-aging"],
    dosage: "500-1000mg daily (sublingual or enteric coated preferred)",
    timing: "Morning on empty stomach",
    timeframe: "Energy effects 1-2 weeks. Cellular effects months.",
    evidence: "moderate",
    foodSources: ["Trace amounts only - supplementation required"],
    cautions: ["Expensive", "Degrades in heat (keep refrigerated)", "May deplete methyl groups"],
    drugInteractions: ["None significant"],
    avoidIf: ["Active cancer (theoretical risk of fueling growth)"],
    cycleTiming: "Used continuously.",
    synergies: ["Resveratrol", "TMG (to replace methyl groups)", "Pterostilbene"],
    conflicts: [],
    systems: ["cellular", "energy", "metabolic"],
    goals: ["longevity", "anti-aging", "energy", "nad"]
  },
  {
    id: "inositol",
    name: "Myo-Inositol",
    type: "other",
    category: "modern",
    description: "Carbocyclic sugar that structures cells. Massive benefits for insulin sensitivity, anxiety, and PCOS.",
    traditionalUse: "Found in cantaloupe and citrus.",
    benefits: ["Reduces anxiety/panic", "PCOS support", "Insulin sensitivity", "Sleep quality", "OCD support", "Fertility"],
    dosage: "2-4g daily for general health or PCOS (pair with D-Chiro-Inositol at a 40:1 ratio). Higher doses (12-18g) used for anxiety/OCD.",
    timing: "With meals for PCOS support; 30 mins before bed for sleep.",
    timeframe: "Anxiety effects 2-4 weeks. Ovulation/metabolic effects 3-6 months.",
    evidence: "strong",
    foodSources: ["Cantaloupe", "Beans", "Brown rice", "Citrus"],
    cautions: ["High doses can cause mild GI distress", "PCOS protocols should use a 40:1 Myo: D-Chiro ratio; other ratios underperform"],
    drugInteractions: ["None significant"],
    avoidIf: ["Generally safe for all"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Magnesium", "Folate", "Choline"],
    conflicts: [],
    systems: ["nervous", "metabolic", "reproductive"],
    goals: ["anxiety", "sleep", "pcos", "blood-sugar", "fertility", "ocd", "ovulation", "insulin-sensitivity", "female-reproductive", "hormonal-balance"]
  },
  {
    id: "apigenin",
    name: "Apigenin",
    type: "other",
    category: "modern",
    description: "Bioflavonoid found in chamomile. Binds to benzodiazepine receptors in the brain to induce sedation without addiction.",
    traditionalUse: "The active calming compound in Chamomile tea.",
    benefits: ["Sleep onset", "Reduces anxiety", "Prostate health", "Increases NAD+ levels", "Neuroprotective"],
    dosage: "50mg daily",
    timing: "30-60 minutes before bed",
    timeframe: "Immediate sleep effects.",
    evidence: "moderate",
    foodSources: ["Chamomile tea", "Parsley", "Celery"],
    cautions: ["Safe at recommended doses"],
    drugInteractions: ["Sedatives", "Blood thinners"],
    avoidIf: ["Pregnancy (lack of data)"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Magnesium", "L-Theanine", "Glycine"],
    conflicts: [],
    systems: ["nervous", "endocrine"],
    goals: ["sleep", "anxiety", "prostate", "calm"]
  },
  {
    id: "pqq",
    name: "PQQ (Pyrroloquinoline Quinone)",
    type: "other",
    category: "modern",
    description: "Redox cofactor that stimulates mitochondrial biogenesis (growth of new mitochondria). Often paired with CoQ10.",
    traditionalUse: "Found in trace amounts in kiwi and parsley.",
    benefits: ["Mitochondrial biogenesis", "Cognitive function", "Energy levels", "Neuroprotection", "Sleep quality"],
    dosage: "10-20mg daily",
    timing: "Morning with food",
    timeframe: "Cognitive/energy effects 4-8 weeks.",
    evidence: "moderate",
    foodSources: ["Kiwi", "Parsley", "Green peppers", "Tofu"],
    cautions: ["Very safe"],
    drugInteractions: ["None significant"],
    avoidIf: ["Generally safe"],
    cycleTiming: "Can be used continuously.",
    synergies: ["CoQ10 (perfect pairing)", "NMN", "Resveratrol"],
    conflicts: [],
    systems: ["energy", "nervous", "cellular"],
    goals: ["energy", "mitochondria", "brain-health", "anti-aging", "cognition"]
  },
  {
    id: "uridine",
    name: "Uridine Monophosphate",
    type: "other",
    category: "modern",
    description: 'Nucleotide that helps build synaptic membranes. Part of the "Mr. Happy Stack" for dopamine and focus.',
    traditionalUse: "Found in beer (brewer's yeast) and breast milk.",
    benefits: ["Synaptic plasticity", "Dopamine receptor density", "Focus and motivation", "Nerve repair", "Potentiates DHA"],
    dosage: "250-500mg daily (sublingual or oral)",
    timing: "Morning with food",
    timeframe: "Cognitive effects 1-2 weeks.",
    evidence: "moderate",
    foodSources: ["Brewer's yeast", "Beer", "Broccoli", "Organ meats"],
    cautions: ["Can deplete Folate/B12"],
    drugInteractions: ["None significant"],
    avoidIf: ["History of cancer (supports cell growth - consult doctor)"],
    cycleTiming: "Cycle 4 weeks on, 1 week off.",
    synergies: ["DHA (Fish Oil)", "Choline (Alpha-GPC)", "B-Complex"],
    conflicts: [],
    systems: ["nervous", "cognitive"],
    goals: ["focus", "dopamine", "memory", "brain-health", "motivation"]
  },
  {
    id: "nattokinase",
    name: "Nattokinase",
    type: "other",
    category: "traditional",
    description: "Enzyme extracted from Natto (fermented soy). Acts as a fibrinolytic (dissolves blood clots) and supports healthy blood pressure.",
    traditionalUse: "Consumed in Japan via Natto for centuries.",
    benefits: ["Improves blood flow", "Dissolves fibrin", "Blood pressure support", "Cardiovascular health", "Sinus health"],
    dosage: "2000-4000 FU (Fibrinolytic Units) daily",
    timing: "Evening on empty stomach",
    timeframe: "Blood flow effects within hours. BP effects 4-8 weeks.",
    evidence: "strong",
    foodSources: ["Natto (fermented soybeans)"],
    cautions: ["Powerful blood thinner"],
    drugInteractions: ["Warfarin", "Aspirin", "Other blood thinners"],
    avoidIf: ["Bleeding disorders", "Before surgery", "Taking blood thinners"],
    cycleTiming: "Used continuously.",
    synergies: ["Serrapeptase", "Garlic"],
    conflicts: ["Blood thinners"],
    systems: ["cardiovascular", "circulatory"],
    goals: ["blood-pressure", "circulation", "heart-health", "clot-prevention"]
  },
  {
    id: "spirulina",
    name: "Spirulina",
    type: "other",
    category: "modern",
    description: "Nutrient-dense blue-green algae rich in protein, phycocyanin, and antioxidants. Supports immune and metabolic health.",
    traditionalUse: "Consumed by Aztecs and in lake regions as a nutrient source.",
    benefits: ["Complete protein", "Antioxidant support", "Immune support", "Anti-inflammatory", "Energy support"],
    dosage: "1-3g daily",
    timing: "Morning with food",
    timeframe: "Energy and antioxidant support within 2-4 weeks.",
    evidence: "moderate",
    foodSources: ["Spirulina powder in smoothies"],
    cautions: ["Quality matters (test for contaminants)"],
    drugInteractions: ["Immunosuppressants", "Blood thinners"],
    avoidIf: ["Autoimmune conditions (use caution)"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Chlorella", "Vitamin C"],
    conflicts: [],
    systems: ["immune", "metabolic"],
    goals: ["immunity", "energy", "inflammation", "antioxidant"]
  },
  {
    id: "chlorella",
    name: "Chlorella",
    type: "other",
    category: "modern",
    description: "Green algae known for chlorophyll content and detox support. Broken cell wall forms improve absorption.",
    traditionalUse: "Used as a nutrient-dense food and detox supplement.",
    benefits: ["Detox support", "Immune support", "Nutrient dense", "Gut health"],
    dosage: "2-3g daily",
    timing: "Morning with food",
    timeframe: "Digestive and detox effects within 2-4 weeks.",
    evidence: "limited",
    foodSources: ["Chlorella tablets or powder"],
    cautions: ["May cause green stools", "Start low to avoid GI upset"],
    drugInteractions: ["Blood thinners", "Immunosuppressants"],
    avoidIf: ["Autoimmune conditions (use caution)"],
    cycleTiming: "Can be used continuously or cycled.",
    synergies: ["Spirulina", "Fiber"],
    conflicts: [],
    systems: ["digestive", "immune"],
    goals: ["detox", "digestion", "immunity", "longevity"]
  },
  {
    id: "omega-3",
    name: "Omega-3 Fish Oil (EPA/DHA)",
    type: "fatty-acid",
    category: "modern",
    description: "Essential fats for brain, heart, endothelial function, and inflammation. EPA supports mood while DHA supports brain structure.",
    traditionalUse: "Obtained through fatty fish consumption. Traditional in coastal cultures.",
    mechanism: "Incorporates into cell membranes to modulate inflammation and support neurocardiovascular signaling.",
    benefits: ["Brain health", "Endothelial support", "Reduces inflammation", "Heart health", "Mood support", "Eye health", "Skin health", "Joint support", "Sperm quality support"],
    dosage: "1000mg combined EPA/DHA daily with at least 200mg DHA. Higher doses reserved for specific clinical goals under guidance.",
    timing: "With fatty meals for absorption",
    timeframe: "Cell membrane changes 3-6 months. Some mood effects 4-8 weeks.",
    evidence: "strong",
    evidenceSources: [
      {
        title: "NIH ODS: Omega-3 Fatty Acids Fact Sheet",
        url: "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-Consumer/",
        note: "Evidence on dosing, cardiovascular support, and safety."
      }
    ],
    foodSources: ["Fatty fish (salmon, mackerel, sardines)", "Fish roe", "Algae (vegan DHA)"],
    cautions: ["Choose quality brands tested for heavy metals", "High doses (>3g/day) may thin blood"],
    drugInteractions: ["Blood thinners (enhanced effect)", "Blood pressure medications"],
    avoidIf: ["Fish allergies", "Before surgery (stop 1-2 weeks prior)"],
    cycleTiming: "Used continuously.",
    synergies: ["Vitamin E (prevents oxidation)", "Vitamin D", "Curcumin"],
    conflicts: ["Take at different time than fiber supplements"],
    systems: ["cardiovascular", "nervous", "immune", "skin"],
    goals: ["brain-health", "heart-health", "inflammation", "mood", "depression", "joints", "skin", "eyes", "fertility", "sexual-health", "sperm-quality"]
  },
  {
    id: "krill-oil",
    name: "Krill Oil",
    type: "fatty-acid",
    category: "modern",
    description: "Omega-3s in phospholipid form with naturally occurring astaxanthin. Often better absorbed at lower doses.",
    traditionalUse: "Derived from Antarctic krill.",
    benefits: ["Heart health", "Brain function", "Phospholipid delivery", "Antioxidant support"],
    dosage: "1-2g daily",
    timing: "With meals containing fat",
    timeframe: "Inflammation and lipid effects over 4-12 weeks.",
    evidence: "moderate",
    foodSources: ["Not typically available as food"],
    cautions: ["Shellfish allergy contraindication"],
    drugInteractions: ["Blood thinners"],
    avoidIf: ["Shellfish allergy", "Before surgery"],
    cycleTiming: "Used continuously.",
    synergies: ["Vitamin D", "Vitamin E"],
    conflicts: [],
    systems: ["cardiovascular", "nervous"],
    goals: ["heart-health", "brain-health", "inflammation"]
  },
  {
    id: "probiotics",
    name: "Probiotics (Multi-strain)",
    type: "probiotic",
    category: "modern",
    description: "Beneficial bacteria supporting gut microbiome. Different strains for different purposes. Foundation of gut-brain axis.",
    traditionalUse: "Fermented foods in all traditional cultures worldwide.",
    benefits: ["Gut flora support", "Immune function", "Mood support (gut-brain axis)", "Digestive health", "Reduces bloating", "Vaginal health"],
    dosage: "10-50 billion CFU multi-strain. Specific strains for specific conditions.",
    timing: "Morning on empty stomach or with meals (strain dependent)",
    timeframe: "GI effects 2-4 weeks. Mood effects 4-8 weeks.",
    evidence: "strong",
    foodSources: ["Yogurt", "Kefir", "Sauerkraut", "Kimchi", "Kombucha", "Miso", "Tempeh"],
    cautions: ["May cause temporary gas/bloating as gut adjusts", "Quality varies greatly"],
    drugInteractions: ["Antibiotics (take separately)", "Immunosuppressants"],
    avoidIf: ["Severely immunocompromised (SIBO risk)", "Central line/port (infection risk)"],
    cycleTiming: "Can be used continuously or in cycles. Rotate strains periodically.",
    synergies: ["Prebiotics (fiber)", "Digestive enzymes", "L-Glutamine"],
    conflicts: ["Antibiotics (take 2-3 hours apart)"],
    systems: ["digestive", "immune", "nervous"],
    goals: ["gut-health", "digestion", "immunity", "mood", "bloating", "ibs"]
  },
  {
    id: "digestive-enzymes",
    name: "Digestive Enzymes (Broad Spectrum)",
    type: "other",
    category: "modern",
    description: "Blend of amylase, protease, lipase, etc. Breaks down food to prevent bloating and increase nutrient absorption.",
    traditionalUse: "Papaya and pineapple used traditionally for enzymes.",
    benefits: ["Reduces bloating instantly", "Improves nutrient absorption", "Reduces post-meal fatigue", "Supports aging digestion"],
    dosage: "1-2 capsules with largest meals",
    timing: "Right before the first bite of food",
    timeframe: "Immediate effect.",
    evidence: "strong",
    foodSources: ["Pineapple (Bromelain)", "Papaya (Papain)", "Raw honey", "Kefir"],
    cautions: ["Do not use if you have Gastritis/Ulcers (protease can irritate)"],
    drugInteractions: ["Blood thinners (if high in bromelain)"],
    avoidIf: ["Active stomach ulcers"],
    cycleTiming: "Use as needed with heavy meals.",
    synergies: ["Betaine HCl", "Probiotics"],
    conflicts: [],
    systems: ["digestive"],
    goals: ["bloating", "digestion", "gut-health", "ibs"]
  },
  {
    id: "collagen",
    name: "Collagen Peptides",
    type: "other",
    category: "modern",
    description: "Hydrolyzed collagen for skin, joints, hair, and gut. Types I & III for skin/hair, Type II for joints. Most abundant protein in body.",
    traditionalUse: "Bone broth and collagen-rich foods in traditional diets worldwide.",
    benefits: ["Skin elasticity", "Reduces wrinkles", "Joint support", "Gut lining support", "Hair and nail strength", "Tendon health"],
    dosage: "10-20g daily",
    timing: "Any time. With vitamin C enhances synthesis. 30-60 min before exercise for tendons.",
    timeframe: "Skin effects 4-8 weeks. Joint effects 3-6 months.",
    evidence: "moderate",
    foodSources: ["Bone broth", "Chicken skin", "Fish with skin", "Gelatin"],
    cautions: ["Generally very safe", "Source matters (marine, bovine, etc.)"],
    drugInteractions: ["None significant"],
    avoidIf: ["Specific allergies to source animal"],
    cycleTiming: "Used continuously.",
    synergies: ["Vitamin C (essential for synthesis)", "Hyaluronic acid", "Silica"],
    conflicts: [],
    systems: ["skin", "connective-tissue", "digestive"],
    goals: ["skin", "wrinkles", "joints", "hair", "nails", "gut-lining", "tendons", "recovery"]
  },
  {
    id: "quercetin",
    name: "Quercetin",
    type: "other",
    category: "modern",
    description: "Powerful flavonoid with anti-inflammatory, antihistamine, and antiviral properties. Emerging senolytic (clears senescent cells).",
    traditionalUse: "Consumed through onions, apples, and other plant foods.",
    benefits: ["Natural antihistamine", "Anti-inflammatory", "Antioxidant", "Immune support", "Antiviral", "Senolytic properties"],
    dosage: "500-1000mg daily",
    timing: "With meals for absorption. Can add bromelain for enhancement.",
    timeframe: "Antihistamine effects within days. Anti-inflammatory 2-4 weeks.",
    evidence: "moderate",
    foodSources: ["Onions", "Apples", "Berries", "Capers", "Citrus", "Broccoli"],
    cautions: ["Poor absorption alone - use with bromelain or phospholipid form"],
    drugInteractions: ["Blood thinners", "Antibiotics", "Cyclosporine"],
    avoidIf: ["Kidney disease (high doses)"],
    cycleTiming: "For senolytic use: intermittent high doses. Otherwise continuous.",
    synergies: ["Bromelain (enhances absorption)", "Vitamin C", "Zinc"],
    conflicts: ["Some antibiotics"],
    systems: ["immune", "cardiovascular"],
    goals: ["allergies", "inflammation", "immunity", "antiviral", "antihistamine", "longevity", "senolytic"]
  },
  {
    id: "melatonin",
    name: "Melatonin",
    type: "other",
    category: "modern",
    description: "The sleep hormone that regulates circadian rhythm. Powerful antioxidant. Lower doses often more effective than higher.",
    traditionalUse: "N/A - naturally produced by pineal gland.",
    mechanism: "Signals circadian rhythm timing via MT1/MT2 receptors to shift sleep onset.",
    benefits: ["Regulates sleep cycle", "Reduces time to fall asleep", "Jet lag relief", "Powerful antioxidant", "Immune support", "Gut health"],
    dosage: "0.3-1mg (start low - more is not better)",
    timing: "30-60 minutes before bed. Dim lights after taking.",
    timeframe: "Sleep effects same night. Circadian adjustment 2-3 days.",
    evidence: "strong",
    evidenceSources: [
      {
        title: "NCCIH: Melatonin",
        url: "https://www.nccih.nih.gov/health/melatonin",
        note: "Evidence overview, dosing, and safety."
      }
    ],
    foodSources: ["Tart cherries", "Eggs", "Milk", "Fish", "Nuts"],
    cautions: ["Higher doses (3mg+) do not improve sleep outcomes but increase next-day grogginess and temperature changes", "May cause vivid dreams"],
    drugInteractions: ["Blood thinners", "Immunosuppressants", "Diabetes medications", "Sedatives", "Birth control"],
    avoidIf: ["Pregnancy", "Autoimmune conditions (may stimulate)", "Depression (may worsen)"],
    cycleTiming: "Best for short-term or occasional use. Long-term use debated.",
    synergies: ["Magnesium", "L-Theanine", "Glycine"],
    conflicts: ["Caffeine", "Bright lights after taking"],
    systems: ["nervous", "immune"],
    goals: ["sleep", "insomnia", "jet-lag", "circadian-rhythm", "antioxidant"]
  },
  {
    id: "alpha-gpc",
    name: "Alpha-GPC",
    type: "other",
    category: "modern",
    description: "Most bioavailable choline source. Crosses blood-brain barrier for acetylcholine synthesis. Supports memory and focus.",
    traditionalUse: "N/A - choline found in eggs and organ meats.",
    benefits: ["Enhances memory", "Supports focus", "Increases acetylcholine", "Power output boost", "Neuroprotective", "Growth hormone support"],
    dosage: "300-600mg daily",
    timing: "Morning. Pre-workout for performance benefits.",
    timeframe: "Cognitive effects within hours to days.",
    evidence: "strong",
    foodSources: ["Eggs", "Liver", "Beef", "Chicken"],
    cautions: ["May cause headache if acetylcholine too high", "Fishy body odor possible"],
    drugInteractions: ["Anticholinergic drugs", "Acetylcholinesterase inhibitors"],
    avoidIf: ["Generally safe"],
    cycleTiming: "Can be used continuously or as needed.",
    synergies: ["Racetams", "Lion's Mane", "Uridine", "DHA"],
    conflicts: ["Anticholinergic medications"],
    systems: ["nervous", "cognitive"],
    goals: ["memory", "focus", "cognition", "athletic-performance", "neuroprotection", "choline"]
  },
  {
    id: "phosphatidylserine",
    name: "Phosphatidylserine (PS)",
    type: "other",
    category: "modern",
    description: "Key phospholipid for brain cell membranes. Helps regulate cortisol and supports memory. FDA qualified health claim for cognitive function.",
    traditionalUse: "N/A - found in organ meats and soy.",
    benefits: ["Memory support", "Reduces cortisol", "Supports cognitive decline", "Improves attention", "ADHD support", "Athletic recovery"],
    dosage: "100-300mg daily",
    timing: "With meals",
    timeframe: "Memory effects 2-4 weeks. Cortisol effects 2-4 weeks.",
    evidence: "strong",
    foodSources: ["Organ meats", "Fish", "Egg yolks", "Soybeans"],
    cautions: ["Very safe", "Sunflower-derived preferred over soy"],
    drugInteractions: ["Blood thinners", "Anticholinergic medications"],
    avoidIf: ["Generally safe for all"],
    cycleTiming: "Used continuously for brain support.",
    synergies: ["DHA", "Alpha-GPC", "Bacopa"],
    conflicts: [],
    systems: ["nervous", "cognitive", "endocrine"],
    goals: ["memory", "cortisol", "cognitive", "adhd", "stress", "brain-health"]
  },
  {
    id: "berberine",
    name: "Berberine",
    type: "herb",
    category: "both",
    description: "Alkaloid from multiple plants. Powerful metabolic effects comparable to metformin. Activates AMPK for longevity.",
    traditionalUse: "Used in Chinese and Ayurvedic medicine for infections and digestive issues.",
    benefits: ["Blood sugar support", "Cholesterol reduction", "AMPK activation", "Gut health", "Anti-inflammatory", "Weight support"],
    dosage: "500mg 2-3x daily with meals",
    timing: "Before or with meals",
    timeframe: "Blood sugar effects 2-4 weeks. Cholesterol 4-8 weeks.",
    evidence: "strong",
    foodSources: ["Not commonly in foods"],
    cautions: ["Can cause GI upset initially", "May lower blood sugar significantly"],
    drugInteractions: ["Many medications (affects CYP enzymes)", "Metformin", "Blood thinners", "Blood pressure meds"],
    avoidIf: ["Pregnancy", "Breastfeeding", "On multiple medications (consult doctor)"],
    cycleTiming: "May cycle 8-12 weeks on, 2-4 weeks off to prevent resistance.",
    synergies: ["Alpha lipoic acid", "Milk thistle (liver support)"],
    conflicts: ["Many pharmaceuticals - check interactions"],
    systems: ["metabolic", "cardiovascular", "digestive"],
    goals: ["blood-sugar", "diabetes", "cholesterol", "weight", "longevity", "metabolism", "ampk"]
  },
  {
    id: "dim",
    name: "DIM (Diindolylmethane)",
    type: "other",
    category: "modern",
    description: 'Concentrated compound from broccoli. Helps liver process estrogen into "good" metabolites. Key for hormonal acne.',
    traditionalUse: "Cruciferous vegetables consumed for health.",
    benefits: ["Estrogen metabolism", "Hormonal acne relief", "PMS support", "Menopause balance", "Estrogen dominance"],
    dosage: "100-200mg daily",
    timing: "With food",
    timeframe: "Acne/Hormone effects 4-8 weeks.",
    evidence: "moderate",
    foodSources: ["Broccoli", "Brussels sprouts", "Cauliflower"],
    cautions: ["May turn urine orange/dark", "Headache initially (detox)"],
    drugInteractions: ["Hormone replacement therapy", "Oral contraceptives"],
    avoidIf: ["Pregnancy", "Breastfeeding"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Calcium D-Glucarate", "Sulforaphane"],
    conflicts: [],
    systems: ["endocrine", "hepatic", "skin"],
    goals: ["acne", "hormonal-balance", "estrogen", "pms", "menopause"]
  },
  {
    id: "same",
    name: "SAMe (S-Adenosyl Methionine)",
    type: "other",
    category: "modern",
    description: "Natural compound involved in methylation and neurotransmitter synthesis. Strong evidence for depression and joint health.",
    traditionalUse: "N/A - modern understanding. Naturally produced in body from methionine.",
    benefits: ["Antidepressant effects", "Joint pain relief", "Liver support", "Methylation support", "Cartilage support"],
    dosage: "Depression: 400-1600mg. Joints: 600-1200mg daily.",
    timing: "Morning on empty stomach (1 hour before or 2 hours after food)",
    timeframe: "Depression effects 1-4 weeks. Joint effects 4-8 weeks.",
    evidence: "strong",
    foodSources: ["Not available in food - made from dietary methionine"],
    cautions: ["Can cause anxiety, insomnia, or GI upset", "May trigger mania in bipolar"],
    drugInteractions: ["SSRIs", "MAOIs", "Parkinson's medications", "Dextromethorphan"],
    avoidIf: ["Bipolar disorder (may trigger mania)", "Anxiety disorders (may worsen)"],
    cycleTiming: "Used continuously under supervision.",
    synergies: ["B12", "Folate", "B6 (needed for metabolism)"],
    conflicts: ["Serotonergic medications"],
    systems: ["nervous", "musculoskeletal", "hepatic"],
    goals: ["depression", "mood", "joints", "liver", "arthritis"]
  },
  {
    id: "resveratrol",
    name: "Resveratrol",
    type: "other",
    category: "modern",
    description: "Polyphenol from grapes that activates sirtuins. Mimics caloric restriction effects. Anti-aging and cardiovascular support.",
    traditionalUse: "Consumed through red wine and grapes.",
    benefits: ["Sirtuin activation", "Cardiovascular protection", "Anti-inflammatory", "Antioxidant", "Brain health", "Anti-aging"],
    dosage: "250-500mg trans-resveratrol daily",
    timing: "Morning with fat. Some take with quercetin and NMN.",
    timeframe: "Effects develop over weeks to months.",
    evidence: "moderate",
    foodSources: ["Red wine", "Red grapes", "Peanuts", "Berries", "Dark chocolate"],
    cautions: ["May have estrogenic effects", "Quality varies"],
    drugInteractions: ["Blood thinners", "Statins", "Some cancer medications"],
    avoidIf: ["Hormone-sensitive conditions", "Bleeding disorders"],
    cycleTiming: "Can be used continuously.",
    synergies: ["NMN/NR", "Quercetin", "Pterostilbene (more bioavailable analog)"],
    conflicts: ["May inhibit some CYP enzymes"],
    systems: ["cardiovascular", "nervous"],
    goals: ["longevity", "anti-aging", "heart-health", "brain-health", "sirtuins"]
  },
  {
    id: "glucosamine",
    name: "Glucosamine Sulfate",
    type: "other",
    category: "modern",
    description: "Building block for cartilage. Decades of research for osteoarthritis. Sulfate form has most evidence.",
    traditionalUse: "N/A - shellfish shells are natural source.",
    benefits: ["Supports cartilage", "Reduces joint pain", "Slows cartilage breakdown", "Improves joint function", "Anti-inflammatory"],
    dosage: "1500mg glucosamine sulfate daily",
    timing: "With meals, can split doses",
    timeframe: "Joint effects 4-8 weeks, continue for 3+ months.",
    evidence: "strong",
    foodSources: ["Shellfish shells (not commonly eaten)"],
    cautions: ["Derived from shellfish - use vegetarian form if allergic"],
    drugInteractions: ["Blood thinners (minor effect)"],
    avoidIf: ["Shellfish allergy (use vegetarian version)", "Pregnancy"],
    cycleTiming: "Used continuously for joint support.",
    synergies: ["Chondroitin", "MSM", "Omega-3", "Curcumin"],
    conflicts: [],
    systems: ["musculoskeletal"],
    goals: ["joint-pain", "arthritis", "cartilage", "mobility", "joints"]
  },
  {
    id: "hyaluronic-acid",
    name: "Hyaluronic Acid",
    type: "other",
    category: "modern",
    description: "Compound that holds 1000x its weight in water. Found in skin, joints, and eyes. Supports hydration and lubrication.",
    traditionalUse: "N/A - found naturally in connective tissues.",
    benefits: ["Skin hydration", "Reduces wrinkles", "Joint lubrication", "Eye health", "Wound healing"],
    dosage: "120-240mg daily",
    timing: "With meals",
    timeframe: "Skin effects 4-8 weeks. Joint lubrication ongoing.",
    evidence: "moderate",
    foodSources: ["Bone broth", "Organ meats", "Soy foods"],
    cautions: ["Very safe"],
    drugInteractions: ["None significant"],
    avoidIf: ["Generally safe for all"],
    cycleTiming: "Used continuously.",
    synergies: ["Collagen", "Vitamin C", "Glucosamine"],
    conflicts: [],
    systems: ["skin", "connective-tissue", "musculoskeletal"],
    goals: ["skin", "hydration", "wrinkles", "joints", "eyes"]
  },
  {
    id: "astaxanthin",
    name: "Astaxanthin",
    type: "other",
    category: "modern",
    description: "Most powerful carotenoid antioxidant from algae. 6000x stronger than vitamin C. Gives salmon and flamingos pink color.",
    traditionalUse: "Consumed through salmon and shrimp.",
    benefits: ["Powerful antioxidant", "Skin protection from UV", "Eye health", "Exercise recovery", "Reduces wrinkles", "Anti-inflammatory"],
    dosage: "4-12mg daily",
    timing: "With fatty food",
    timeframe: "Skin effects 4-8 weeks. Exercise benefits 2-4 weeks.",
    evidence: "moderate",
    foodSources: ["Wild salmon", "Shrimp", "Lobster", "Crab", "Trout"],
    cautions: ["May turn skin slightly orange at very high doses (harmless)"],
    drugInteractions: ["None significant"],
    avoidIf: ["Generally safe for all"],
    cycleTiming: "Used continuously.",
    synergies: ["Vitamin E", "Other carotenoids", "Omega-3"],
    conflicts: [],
    systems: ["skin", "eyes", "muscular"],
    goals: ["skin", "antioxidant", "eyes", "sun-protection", "recovery", "wrinkles", "inflammation"]
  },
  // ============ SPORTS & PERFORMANCE SUPPLEMENTS ============
  {
    id: "citrulline",
    name: "Citrulline (L-Citrulline)",
    type: "amino-acid",
    category: "modern",
    description: "Nitric oxide precursor that improves blood flow, exercise performance, and erection hardness by raising arginine levels more effectively than L-arginine.",
    traditionalUse: "Found naturally in watermelon.",
    benefits: ["Increases nitric oxide", "Improves blood flow", "Supports erection hardness", "Enhances endurance", "Muscle pump support"],
    dosage: "1-3g daily for sexual function or 6-8g L-citrulline (8-10g citrulline malate) pre-workout",
    timing: "Daily for sexual health or 30-60 minutes before exercise",
    timeframe: "Erection hardness improvements in 4+ weeks; acute pump effects same workout.",
    evidence: "moderate",
    foodSources: ["Watermelon", "Cucumbers", "Pumpkin"],
    cautions: ["May cause mild GI upset at high doses"],
    drugInteractions: ["Blood pressure medications", "Nitrates", "ED medications"],
    avoidIf: ["Low blood pressure", "On nitrate medications"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Beetroot/nitrates", "Beta-alanine", "Creatine"],
    conflicts: [],
    systems: ["cardiovascular", "muscular"],
    goals: ["blood-flow", "endurance", "performance", "pump", "sexual-health", "erectile-function"]
  },
  {
    id: "l-citrulline",
    name: "L-Citrulline",
    type: "amino-acid",
    category: "modern",
    description: "Nitric oxide precursor superior to L-arginine for absorption. Increases blood flow, endurance, and supports erection hardness.",
    traditionalUse: "Found naturally in watermelon.",
    benefits: ["Increases nitric oxide", "Enhances blood flow", "Supports erection hardness", "Reduces fatigue", "Improves endurance", "Muscle pumps", "Blood pressure support"],
    dosage: "1-3g daily for sexual function or 6-8g L-Citrulline (8-10g Citrulline Malate) pre-workout",
    timing: "Daily for sexual health or 30-60 minutes before exercise",
    timeframe: "Erection hardness improvements in 4+ weeks. Endurance benefits 7-14 days.",
    evidence: "moderate",
    foodSources: ["Watermelon", "Cucumbers", "Pumpkin"],
    cautions: ["Very safe", "May cause mild GI upset at high doses"],
    drugInteractions: ["Blood pressure medications", "ED medications", "Nitrates"],
    avoidIf: ["Low blood pressure", "On nitrate medications"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Beetroot/nitrates", "Grape seed extract"],
    conflicts: [],
    systems: ["cardiovascular", "muscular"],
    goals: ["endurance", "blood-flow", "pump", "exercise", "blood-pressure", "performance", "sexual-health", "erectile-function"]
  },
  {
    id: "l-arginine",
    name: "L-Arginine",
    type: "amino-acid",
    category: "modern",
    description: "Nitric oxide precursor that supports blood flow. Meta-analyses show modest improvements in erectile function at higher daily doses.",
    traditionalUse: "Found in protein-rich foods.",
    benefits: ["Nitric oxide support", "Blood flow", "Exercise performance", "Libido support", "Erectile function support"],
    dosage: "1.5-5g daily (often split doses)",
    timing: "Split doses with meals or 30-60 minutes before activity",
    timeframe: "Erectile function improvements in 4-8 weeks with consistent use.",
    evidence: "moderate",
    foodSources: ["Turkey", "Chicken", "Pork", "Pumpkin seeds", "Legumes"],
    cautions: ["May cause GI upset at higher doses", "Can lower blood pressure", "May trigger herpes outbreaks in susceptible individuals"],
    drugInteractions: ["Blood pressure medications", "ED medications", "Nitrates"],
    avoidIf: ["Low blood pressure", "On nitrate medications"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Citrulline", "Beetroot/nitrates"],
    conflicts: [],
    systems: ["cardiovascular", "reproductive"],
    goals: ["blood-flow", "performance", "libido", "sexual-health", "erectile-function"]
  },
  {
    id: "beta-alanine",
    name: "Beta-Alanine",
    type: "amino-acid",
    category: "modern",
    description: "Precursor to carnosine, which buffers acid in muscles. Extends high-intensity exercise capacity. Causes harmless tingling.",
    traditionalUse: "Found in meat and poultry.",
    benefits: ["Increases muscle carnosine", "Delays muscular fatigue", "Improves high-intensity performance", "Extends time to exhaustion"],
    dosage: "3.2-6.4g daily in divided doses",
    timing: "Split into 2-4 doses daily. Timing not critical (chronic effect).",
    timeframe: "Carnosine saturation takes 4-10 weeks. Peak benefits at 12 weeks.",
    evidence: "strong",
    foodSources: ["Chicken", "Beef", "Fish", "Pork"],
    cautions: ["Paresthesia (tingling) is harmless but can be uncomfortable"],
    drugInteractions: ["May interact with heart medications affecting taurine"],
    avoidIf: ["Generally safe for all"],
    cycleTiming: "Can be used continuously. Effects persist 6-15 weeks after stopping.",
    synergies: ["Creatine", "Sodium bicarbonate", "Citrulline"],
    conflicts: ["May compete with taurine absorption long-term"],
    systems: ["muscular"],
    goals: ["endurance", "high-intensity", "crossfit", "hiit", "athletic-performance", "fatigue"]
  },
  {
    id: "l-glutamine",
    name: "L-Glutamine",
    type: "amino-acid",
    category: "modern",
    description: "Most abundant amino acid in body. Supports gut lining, immune function, and recovery during extreme stress.",
    traditionalUse: "Abundant in protein-rich foods.",
    benefits: ["Gut lining support", "Immune support during stress", "May reduce sugar cravings", "Recovery during illness"],
    dosage: "5-10g daily. Up to 30g/day for gut healing.",
    timing: "Any time. Often post-workout or before bed.",
    timeframe: "Gut effects 2-4 weeks. Immune support ongoing.",
    evidence: "moderate",
    foodSources: ["Beef", "Eggs", "Tofu", "White rice", "Corn"],
    cautions: ["Very safe", "May avoid if sensitive to MSG"],
    drugInteractions: ["Chemotherapy drugs", "Anti-seizure medications"],
    avoidIf: ["Severe liver disease", "MSG sensitivity"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Probiotics", "Zinc", "N-Acetyl Glucosamine"],
    conflicts: [],
    systems: ["digestive", "immune", "muscular"],
    goals: ["gut-health", "leaky-gut", "immunity", "recovery", "sugar-cravings"]
  },
  {
    id: "beetroot-extract",
    name: "Beetroot Extract / Nitrates",
    type: "other",
    category: "modern",
    description: "Concentrated dietary nitrates that convert to nitric oxide. Proven to enhance endurance 1-3%. Used by Olympic athletes.",
    traditionalUse: "Beets consumed traditionally for vitality.",
    benefits: ["Increases nitric oxide", "Improves endurance 1-3%", "Reduces oxygen cost of exercise", "Lowers blood pressure"],
    dosage: "300-600mg nitrates (500ml beet juice or 70ml concentrate)",
    timing: "2-3 hours before exercise for peak nitrate levels",
    timeframe: "Acute effects same workout. Enhanced with chronic use.",
    evidence: "strong",
    foodSources: ["Beetroot", "Spinach", "Arugula", "Celery"],
    cautions: ["May turn urine/stool pink (harmless)", "High oxalate content"],
    drugInteractions: ["Blood pressure medications", "ED medications"],
    avoidIf: ["Kidney stone history", "Very low blood pressure"],
    cycleTiming: "Can be used continuously or before events.",
    synergies: ["Citrulline", "Vitamin C"],
    conflicts: ["Mouthwash kills bacteria needed for nitrate conversion"],
    systems: ["cardiovascular", "muscular"],
    goals: ["endurance", "blood-pressure", "blood-flow", "exercise", "running", "cycling"]
  },
  {
    id: "caffeine",
    name: "Caffeine",
    type: "other",
    category: "modern",
    description: "Most widely used performance enhancer. Improves endurance, strength, and focus. Tolerance develops but benefits persist.",
    traditionalUse: "Coffee and tea consumed for millennia.",
    benefits: ["Increases alertness", "Improves endurance 2-4%", "Enhances strength", "Reduces perceived exertion", "Improves focus"],
    dosage: "3-6mg per kg bodyweight (200-400mg for 70kg person)",
    timing: "30-60 minutes before exercise or mental task",
    timeframe: "Effects within 30-60 minutes, lasting 4-6 hours.",
    evidence: "strong",
    foodSources: ["Coffee", "Tea", "Cacao"],
    cautions: ["Disrupts sleep if taken late", "Anxiety in sensitive individuals", "Withdrawal headaches"],
    drugInteractions: ["MAOIs", "Stimulants", "Bronchodilators"],
    avoidIf: ["Anxiety disorders", "Heart arrhythmias", "Insomnia"],
    cycleTiming: "Can cycle off 1-2 weeks to resensitize.",
    synergies: ["L-Theanine", "Creatine", "Beta-alanine"],
    conflicts: ["Late-day use conflicts with sleep"],
    systems: ["nervous", "energy"],
    goals: ["energy", "focus", "endurance", "performance", "alertness", "fat-burning"]
  },
  {
    id: "alpha-lipoic-acid",
    name: "Alpha-Lipoic Acid (ALA)",
    type: "other",
    category: "modern",
    description: "Universal antioxidant soluble in water and fat. Regenerates other antioxidants. R-ALA is the active isomer; racemic forms require higher dosing.",
    traditionalUse: "Found in organ meats and vegetables.",
    benefits: ["Universal antioxidant", "Regenerates vitamins C and E", "Blood sugar support", "Nerve health", "Heavy metal chelation"],
    dosage: "300-600mg R-ALA or 600-1200mg racemic ALA",
    timing: "Empty stomach. With carb meals for glucose disposal.",
    timeframe: "Antioxidant effects immediate. Blood sugar 4-8 weeks.",
    evidence: "strong",
    foodSources: ["Organ meats", "Broccoli", "Spinach", "Tomatoes"],
    cautions: ["May lower blood sugar significantly", "R-ALA is more potent"],
    drugInteractions: ["Diabetes medications", "Thyroid medications", "Chemotherapy"],
    avoidIf: ["Thiamine (B1) deficiency"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Acetyl-L-Carnitine", "CoQ10", "NAC"],
    conflicts: ["Take away from minerals"],
    systems: ["metabolic", "nervous"],
    goals: ["blood-sugar", "antioxidant", "nerve-health", "neuropathy", "heavy-metals", "anti-aging"]
  },
  /** Source: STACKS_ALIGNMENT_RESEARCH_REPORT.md */
  {
    id: "tribulus",
    name: "Tribulus Terrestris (Gokshura)",
    type: "ayurvedic",
    category: "both",
    description: "Primary male fertility herb supporting sperm count and motility, with additional libido support. Evidence is mixed; best-studied extracts are standardized to protodioscin.",
    traditionalUse: "Used in Ayurveda for male vitality, urinary health, and reproductive rejuvenation.",
    safetyNote: "Discontinue immediately upon positive pregnancy test.",
    benefits: ["Improves sperm count & motility", "Supports testosterone levels", "Improves sexual desire", "Strengthens urinary function"],
    dosage: "750-1500mg standardized extract (40-45% protodioscin; 45-60% saponins)",
    timing: "Divided doses with meals",
    timeframe: "Sperm improvements take 3-6 months (full sperm cycle).",
    evidence: "moderate",
    foodSources: ["Not available in food"],
    cautions: ["Testosterone increases are inconsistent in men with normal baseline levels", "Recent reviews report mixed outcomes on sexual function"],
    drugInteractions: ["Diabetes medications", "Blood pressure medications", "Lithium"],
    avoidIf: ["Hormone-sensitive cancers", "Pregnancy", "Breastfeeding"],
    cycleTiming: "Cycle 8 weeks on, 4 weeks off.",
    synergies: ["Ashwagandha", "Tongkat Ali", "Maca", "Mucuna"],
    conflicts: [],
    systems: ["urinary", "reproductive"],
    goals: ["libido", "sexual-health", "urinary-health", "kidney-stones", "prostate", "fertility", "male-reproductive", "sperm-quality", "testosterone"]
  },
  {
    id: "fenugreek",
    name: "Fenugreek (Methi)",
    type: "ayurvedic",
    category: "both",
    description: "Culinary spice with evidence for blood sugar, libido, and testosterone support. Best-studied extracts include Testofen\xC2\xAE and Trigozim\xC2\xAE.",
    traditionalUse: "Used in Indian cooking and Ayurveda for digestion, lactation, and as a tonic.",
    benefits: ["Blood sugar support", "May support testosterone", "Lactation enhancement", "Digestive support", "May improve libido"],
    dosage: "600mg/day Testofen\xC2\xAE for libido or 1200-1800mg/day Trigozim\xC2\xAE for testosterone support",
    timing: "With meals. For blood sugar: before carb-heavy meals.",
    timeframe: "Blood sugar effects 2-4 weeks. Hormonal effects 6-12 weeks.",
    evidence: "moderate",
    foodSources: ["Fenugreek seeds", "Fenugreek leaves (methi)", "Curry dishes"],
    cautions: ["May cause maple syrup body odor", "Blood sugar effects significant"],
    drugInteractions: ["Diabetes medications", "Blood thinners"],
    avoidIf: ["Pregnancy", "Hormone-sensitive conditions"],
    cycleTiming: "Can be used continuously.",
    synergies: ["Ashwagandha", "Zinc"],
    conflicts: [],
    systems: ["metabolic", "endocrine", "digestive"],
    goals: ["blood-sugar", "testosterone", "lactation", "libido", "sexual-health", "digestion", "fertility", "male-reproductive"]
  },
  // ============ FERTILITY & REPRODUCTIVE HEALTH (NEW ADDITIONS) ============
  /** Source: STACKS_ALIGNMENT_RESEARCH_REPORT.md */
  {
    id: "vitex",
    name: "Vitex (Chasteberry)",
    type: "herb",
    category: "both",
    description: "Premier herbal fertility support. Clinical trials show 26-36% pregnancy rate improvement. Works through LH/FSH modulation.",
    traditionalUse: 'Used for centuries in Europe for female fertility and cycle regulation. Called "Female Viagra" for reproductive hormones.',
    safetyNote: "Discontinue immediately upon positive pregnancy test.",
    benefits: [
      "Improves ovulation quality",
      "Increases progesterone levels",
      "Regulates menstrual cycle length",
      "Reduces luteal phase defect",
      "Improves fertility rates",
      "Reduces PMS symptoms"
    ],
    dosage: "400mg standardized extract (0.6% casticin) daily",
    timing: "Morning on empty stomach",
    timeframe: "Cycle regulation 1-3 months. Fertility effects 3-6 months.",
    evidence: "strong",
    foodSources: ["Not available in food"],
    cautions: ["May cause dopamine-related effects", "Discontinue once pregnancy is confirmed"],
    drugInteractions: ["Dopamine antagonists", "Antipsychotics", "Hormonal contraceptives"],
    avoidIf: ["On dopamine-blocking medications", "Pregnancy (use for conception only)"],
    cycleTiming: "Daily throughout cycle. Minimum 3 months.",
    synergies: ["Maca", "Red Clover", "CoQ10"],
    conflicts: [],
    systems: ["reproductive", "endocrine", "hormonal"],
    goals: ["fertility", "sexual-health", "female-reproductive", "hormonal-balance", "ovulation", "progesterone", "pms", "cycle-regulation"]
  },
  {
    id: "red-clover",
    name: "Red Clover",
    type: "herb",
    category: "traditional",
    description: "Rich in isoflavones that support estrogen balance and cervical mucus quality. Efficacy is dose-dependent.",
    traditionalUse: "Traditional women's tonic for fertility and hormone balance.",
    benefits: [
      "Supports estrogen balance",
      "Improves cervical mucus",
      "Supports uterine health"
    ],
    dosage: "80-160mg isoflavones daily (40mg often ineffective)",
    timing: "Any time",
    timeframe: "8-12 weeks for hormone symptom shifts.",
    evidence: "moderate",
    foodSources: ["Red clover tea"],
    cautions: ["Estrogenic effects"],
    drugInteractions: ["Blood thinners", "Estrogen therapies"],
    avoidIf: ["Estrogen-sensitive cancers"],
    cycleTiming: "Continuous.",
    synergies: ["Vitex", "Shatavari"],
    conflicts: [],
    systems: ["reproductive", "hormonal"],
    goals: ["fertility", "sexual-health", "female-reproductive", "hormonal-balance", "cervical-mucus"]
  },
  /** Source: STACKS_ALIGNMENT_RESEARCH_REPORT.md */
  {
    id: "l-carnitine",
    name: "L-Carnitine",
    type: "amino-acid",
    category: "modern",
    description: "Essential for sperm mitochondrial energy. Improves sperm motility by 30-40%.",
    traditionalUse: "Modern supplement.",
    benefits: [
      "Improves sperm motility",
      "Supports mitochondrial energy",
      "Reduces sperm DNA fragmentation"
    ],
    dosage: "2-3g daily",
    timing: "With food",
    timeframe: "3-6 months for sperm quality.",
    evidence: "moderate",
    foodSources: ["Red meat", "Dairy"],
    cautions: ["Fishy body odor (rare)"],
    drugInteractions: [],
    avoidIf: [],
    cycleTiming: "Continuous.",
    synergies: ["CoQ10", "Zinc"],
    conflicts: [],
    systems: ["reproductive", "energy"],
    goals: ["fertility", "male-reproductive", "sperm-quality", "sperm-motility", "energy"]
  }
];
export {
  analyzeGoal,
  dedupeSupplementsByCanonical,
  getCanonicalSupplementKey,
  searchSupplementsWithScores,
  suggestClosestSupplementTerm,
  supplements
};
/*! Bundled license information:

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
