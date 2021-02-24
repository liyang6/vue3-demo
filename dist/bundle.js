(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueReactivity = {}));
}(this, (function (exports) { 'use strict';

  var isObject = function (val) { return typeof val == 'object' && val !== null; };

  var effect = function (fn) {
      var effect = createReactiveEffect(fn);
      effect();
  };
  var effectStack = [];
  function createReactiveEffect(fn) {
      var effect = function () {
          effectStack.push(fn);
          fn();
      };
      return effect;
  }

  var mutableHandlers = {
      get: function (target, key, recevier) {
          console.log('get');
          return Reflect.get(target, key, recevier); // taget[key]
      },
      set: function (target, key, value, recevier) {
          console.log('set');
          var result = Reflect.set(target, key, value, recevier);
          effectStack.forEach(function (effect) { return effect(); });
          return result;
      } // 当设置值的时候 应该通知对
  };

  var reactive = function (target) {
      return createReactiveObject(target, mutableHandlers);
  };
  var reactiveMap = new WeakMap();
  /*
  WeakMap
    {
    target:
      {} ：new proxy(target)
    }
  */
  function createReactiveObject(target, baseHandler) {
      if (!isObject(target)) {
          return target;
      }
      var existProxy = reactiveMap.get(target);
      if (existProxy) {
          return existProxy;
      }
      var proxy = new Proxy(target, baseHandler);
      reactiveMap.set(target, proxy);
      return proxy;
  }

  exports.effect = effect;
  exports.reactive = reactive;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.js.map
