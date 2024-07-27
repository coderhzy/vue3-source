// packages/shared/src/index.ts
function isObject(value) {
  return typeof value === "object" && value !== null;
}

// packages/reactivity/src/baseHandler.ts
var mutableHandlers = {
  get(target, key, receiver) {
    if (key === "__v_isReactive" /* IS_REACTIVE */) {
      return true;
    }
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    return Reflect.set(target, key, value, receiver);
  }
};

// packages/reactivity/src/reactive.ts
var reactiveMap = /* @__PURE__ */ new WeakMap();
function createReactiveObject(target) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_isReactive" /* IS_REACTIVE */]) {
    console.log(target["__v_isReactive" /* IS_REACTIVE */]);
    return target;
  }
  const existsProxy = reactiveMap.get(target);
  if (existsProxy) {
    return existsProxy;
  }
  let proxy = new Proxy(target, mutableHandlers);
  console.log("\u{1F680} ~ createReactiveObject ~ proxy:", proxy["__v_isReactive" /* IS_REACTIVE */]);
  reactiveMap.set(target, proxy);
  return proxy;
}
function reactive(target) {
  return createReactiveObject(target);
}

// packages/reactivity/src/effect.ts
function effect() {
  console.log("effect");
}
export {
  effect,
  reactive
};
//# sourceMappingURL=reactivity.js.map
