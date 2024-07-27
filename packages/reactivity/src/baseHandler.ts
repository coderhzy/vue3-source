export enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
}

export const mutableHandlers: ProxyHandler<any> = {
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        }
        // todo: 依赖收集

        // 当取值的时候, 应该让响应式属性 和 effect 映射起来
        return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
        // 找到属性 让那个页面更新

        // todo: 触发更新
        return Reflect.set(target, key, value, receiver)
    }
}