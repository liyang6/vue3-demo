import { isObject } from "../shared"
import { mutableHandlers } from "./baseHandlers";

export const reactive = (target) => {
    return createReactiveObject(target,mutableHandlers)
}

const reactiveMap = new WeakMap();
/* 
WeakMap
  {
  target:
    {} ：new proxy(target)
  }
*/
function createReactiveObject(target,baseHandler) { 
  if (!isObject(target)) { 
    return target
  }

  let existProxy = reactiveMap.get(target);
  if (existProxy) { 
    return existProxy
  }

  const proxy = new Proxy(target, baseHandler);
  reactiveMap.set(target, proxy);
  return proxy;
}
