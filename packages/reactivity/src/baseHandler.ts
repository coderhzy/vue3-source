import { activeEffect } from "./effect"
import { track, trigger } from "./reactiveEffect"

export enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
}

export const mutableHandlers: ProxyHandler<any> = {
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        }

        track(target, key) // 收集这个对象上的属性，和effect关联在一起

        // 当取值的时候, 应该让响应式属性 和 effect 映射起来
        return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
        // 找到属性 让那个页面更新

        let oldValue = target[key];
        let result = Reflect.set(target, key, value, receiver)

        // 比较新旧值
        if (oldValue !== value) {
            // 需要触发更新
            trigger(target, key, value, oldValue)
        }

        return result
    }
}