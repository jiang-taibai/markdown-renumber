/**
 * 深拷贝
 * @param obj {Object}      待拷贝的对象
 * @param hash {WeakMap}    用于处理循环引用
 * @returns {Object}        拷贝后的对象
 */
export const deepClone = (obj, hash = new WeakMap()) => {
    // 若obj为null 或者 obj 不是对象和数组, 则返回 obj
    if (obj === null || typeof obj !== 'object') return obj;

    // 若hash中有obj对象, 则直接返回该对象(处理循环引用)
    if (hash.has(obj)) return hash.get(obj);

    const t = new obj.constructor();
    hash.set(obj, t);

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            t[key] = deepClone(obj[key], hash);
        }
    }

    return t;
}