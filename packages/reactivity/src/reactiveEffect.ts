import { activeEffect, trackEffects, triggerEffects } from "./effect";

const targetMap = new WeakMap(); // 存放依赖收集的关系、

export const createDep = (cleanup, key) => {
    const dep = new Map() as any;
    dep.cleanup = cleanup
    dep.name = key
    return dep
}

export function track(target, key) {
    if (activeEffect) {
        let depsMap = targetMap.get(target)

        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()))
        }

        let dep = depsMap.get(key)

        if (!dep) {
            depsMap.set(key, dep = createDep(() => depsMap.delete(key), key)) // 后面用于清理不需要的属性
        }


        trackEffects(activeEffect, dep) // 将当前的effect放到dep中，后续可以根据值的变化触发此dep中的effect

        console.log(targetMap)
    }
}


export function trigger(target, key, value, oldValue) {
    const depsMap = targetMap.get(target)

    if (!depsMap) { // 找不到对象 === 没收集依赖 ，直接return
        return
    }

    let dep = depsMap.get(key)

    if (dep) { // 说明修改的属性对应了effect
        triggerEffects(dep)
    }
}