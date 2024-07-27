import { isObject } from "@vue/shared";
import { mutableHandlers, ReactiveFlags } from "./baseHandler";

// 用于记录我们 代理后的结果
const reactiveMap = new WeakMap();

function createReactiveObject(target) {
    // 统一做判断,响应式对象必须是对象才可以
    if (!isObject(target)) {
        return target;
    }

    if (target[ReactiveFlags.IS_REACTIVE]) {
        console.log(target[ReactiveFlags.IS_REACTIVE])
        return target
    }

    const existsProxy = reactiveMap.get(target);

    // 取缓存 如果存在直接返回
    if (existsProxy) {
        return existsProxy
    }

    let proxy = new Proxy(target, mutableHandlers);
    console.log("🚀 ~ createReactiveObject ~ proxy:", proxy[ReactiveFlags.IS_REACTIVE])
    reactiveMap.set(target, proxy)
    return proxy
}

// reactive shallowReactive
export function reactive(target) {
    return createReactiveObject(target);
}
