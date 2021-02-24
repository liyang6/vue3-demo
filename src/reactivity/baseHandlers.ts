import { effectStack } from "./effect";

export const mutableHandlers = {
  get(target, key, recevier) {  // 内置的 proxy中get和set参数是固定的

    console.log('get')

    return Reflect.get(target, key, recevier); // taget[key]
  }, // 当取值的时候 应该将effect 存储起来
  set(target, key, value, recevier) {

      console.log('set')
      let result = Reflect.set(target, key, value, recevier);
      effectStack.forEach(effect=>effect());
      return result
  } // 当设置值的时候 应该通知对
}