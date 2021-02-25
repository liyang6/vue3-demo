import { isArray } from "../shared";

export const effect = (fn) => { 
  const effect = createReactiveEffect(fn);
  effect();
}

export let effectStack = []
export let activeEffect = null
let id = 0;
function createReactiveEffect(fn) { 
  const effect = function () { 
    /* ？？？？？？？？ */
    if (!effectStack.includes(effect)) { 
      try {
        effectStack.push(effect);
        activeEffect = effect;
        return fn();
      } finally { 
        effectStack.pop();
        activeEffect = effectStack[effectStack.length-1]
      }
    }
   
    
    
  }
  effect.id = id++;

  return effect;
}

const targetMap = new WeakMap;
/* { 
  对象：{name:[]}
} */
export function track(target, key) {
  if (activeEffect == null) {
    return;
  }

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map());
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, dep = new Set())
  }

  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
  }

  
  console.log('targetMap',targetMap);

}

// 修改
export function trigger(target,type,key,value) { 
  const depsMap = targetMap.get(target);
  if (!depsMap) { // 没有依赖直接跳过 
    return;
  }

  if (!key) {  //没有标识
    return;
  }

  /* ？？？？？？？？ */
  if (key === 'length' && isArray(target)) {
    depsMap.forEach((dep, key) => {
      console.log('----', dep, key, value);
      
      if (key === 'length' || key > value) {
        run(dep)
      }

    })
  } else { 
    let effects = depsMap.get(key); // 收集过
    run(effects);

    // 依赖，添加，数组，修改下标的时候push
    switch (type) { 
      case 'add':
        if (isArray(target)) { 
          if (parseInt(key) == key) {
            debugger
            run(depsMap.get('length')) /* ？？？？？？？？ */
          }
        }
    }
  }

  
  
}

function run(effects) { 
  if(effects) effects.forEach(effect => effect());
}


  




