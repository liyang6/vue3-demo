export const effect = (fn) => { 
  const effect = createReactiveEffect(fn);
  effect();
}
export let effectStack = []
function createReactiveEffect(fn) { 
  const effect = function () { 
    effectStack.push(fn);
    fn();
  }

  return effect;
}