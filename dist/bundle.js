(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueReactivity = {}));
}(this, (function (exports) { 'use strict';

  var isObject = function (val) { return typeof val == 'object' && val !== null; };
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var hasOwn = function (target, key) { return hasOwnProperty.call(target, key); };
  var isArray = function (target) { return Array.isArray(target); };
  var hasChange = function (oldVal, newVal) { return oldVal !== newVal; };

  var effect = function (fn) {
      var effect = createReactiveEffect(fn);
      effect();
  };
  var effectStack = [];
  var activeEffect = null;
  var id = 0;
  function createReactiveEffect(fn) {
      var effect = function () {
          /* ？？？？？？？？ */
          if (!effectStack.includes(effect)) {
              try {
                  effectStack.push(effect);
                  activeEffect = effect;
                  return fn();
              }
              finally {
                  effectStack.pop();
                  activeEffect = effectStack[effectStack.length - 1];
              }
          }
      };
      effect.id = id++;
      return effect;
  }
  var targetMap = new WeakMap;
  /* {
    对象：{name:[]}
  } */
  function track(target, key) {
      if (activeEffect == null) {
          return;
      }
      var depsMap = targetMap.get(target);
      if (!depsMap) {
          targetMap.set(target, depsMap = new Map());
      }
      var dep = depsMap.get(key);
      if (!dep) {
          depsMap.set(key, dep = new Set());
      }
      if (!dep.has(activeEffect)) {
          dep.add(activeEffect);
      }
      console.log('targetMap', targetMap);
  }
  // 修改
  function trigger(target, type, key, value) {
      var depsMap = targetMap.get(target);
      if (!depsMap) { // 没有依赖直接跳过 
          return;
      }
      if (!key) { //没有标识
          return;
      }
      /* ？？？？？？？？ */
      if (key === 'length' && isArray(target)) {
          depsMap.forEach(function (dep, key) {
              console.log('----', dep, key, value);
              if (key === 'length' || key > value) {
                  run(dep);
              }
          });
      }
      else {
          var effects = depsMap.get(key); // 收集过
          run(effects);
          // 依赖，添加，数组，修改下标的时候push
          switch (type) {
              case 'add':
                  if (isArray(target)) {
                      if (parseInt(key) == key) {
                          debugger;
                          run(depsMap.get('length')); /* ？？？？？？？？ */
                      }
                  }
          }
      }
  }
  function run(effects) {
      if (effects)
          effects.forEach(function (effect) { return effect(); });
  }

  var mutableHandlers = {
      get: function (target, key, recevier) {
          console.log('get', target, key, recevier);
          var res = Reflect.get(target, key, recevier);
          if (typeof key === 'symbol') {
              return res;
          }
          track(target, key); //属性和effect关联
          return isObject(res) ? reactive(res) : res; // taget[key]
      },
      set: function (target, key, value, recevier) {
          var oldVal = target[key];
          var result = Reflect.set(target, key, value, recevier);
          var hadKey = isArray(target) && parseInt(key) == key ? Number(key) < target.length : hasOwn(target, key);
          // 新增、修改操作
          if (!hadKey) {
              trigger(target, 'add', key, value);
          }
          else if (hasChange(oldVal, value)) {
              trigger(target, 'set', key, value);
          }
          // effectStack.forEach(effect=>effect());
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
