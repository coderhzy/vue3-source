export function effect(fn, options = {}) {
    // 1. 创建响应式的 effect, 数据变化后重新执行

    // 创建一个effect，只要依赖属性变化，就会重新执行
    const _effect = new ReactiveEffect(fn, () => {
        // scheduler
        _effect.run()
    });
    _effect.run()

    return _effect
}
export let activeEffect;
class ReactiveEffect {
    _trackId = 0; // 用于记录当前effect执行了几次
    deps = [] // 用于收集依赖
    _depsLength = 0 // 用于记录依赖的长度

    public active = true // 创建的effect是响应式的
    // fn 用户编写的函数
    // 如果fn中依赖的数据发生变化后， 需要重新调用 -> run()
    constructor(public fn, public scheduler) {

    }

    run() {

        if (!this.active) {
            // 让fn执行
            return this.fn() // 不是激活的，执行后什么都不做
        }


        let lastEffect = activeEffect
        try {
            activeEffect = this
            // 是激活的，做依赖手机
            return this.fn()
        } finally {
            activeEffect = lastEffect
        }
    }
}

export function trackEffects(effect, dep) {
    dep.set(effect, effect._trackId)
    // 我还想让effect和dep关联起来
    effect.deps[effect._depsLength++] = dep
}

export function triggerEffects(dep) {
    for (const effect of dep.keys()) {
        if (effect.scheduler) {
            effect.scheduler() // -> effect.run()
        }
    }
}