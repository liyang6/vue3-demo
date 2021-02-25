import { effectStack,track, trigger } from "./effect";
import { isObject, isArray, hasOwn, hasChange } from "../shared";
import { reactive } from "./reactive";

export const mutableHandlers = {
  get(target, key, recevier) {  // 内置的 proxy中get和set参数是固定的

    console.log('get',target, key, recevier)
    let res = Reflect.get(target, key, recevier);

    if (typeof key === 'symbol') { 
      return res;
    }

    track(target, key); //属性和effect关联

    return isObject(res) ? reactive(res) : res; // taget[key]
  }, // 当取值的时候 应该将effect 存储起来
  set(target, key, value, recevier) {
    let oldVal = target[key]
    let result = Reflect.set(target, key, value, recevier);

    let hadKey = isArray(target) && parseInt(key) == key ? Number(key) < target.length : hasOwn(target, key);
    // 新增、修改操作
    if (!hadKey) {
      trigger(target, 'add', key, value)
    } else if(hasChange(oldVal,value)){ 
      trigger(target,'set',key,value)
    }
      // effectStack.forEach(effect=>effect());
      return result
  } // 当设置值的时候 应该通知对
}