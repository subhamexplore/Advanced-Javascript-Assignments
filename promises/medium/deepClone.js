
// Problem Description – Deep Clone with Circular References
//
// You are required to implement deepClone(obj).
//
// Standard JSON cloning fails for circular references and complex objects.
// Your clone must correctly handle circular dependencies (e.g. obj.self = obj).
//
// Requirements:
// 1. Deeply clone objects and arrays
// 2. Preserve nested structures
// 3. Detect and handle circular references using a WeakMap
//
function deepClone(value, map = new WeakMap()) { 
    if(value === null || typeof(value)!='object')
        return value
    if(map.has(value))
        return map.get(value)
    const result = Array.isArray(value)?[]:{}
    map.set(value, result)
    for(let key in value){
        result[key] = deepClone(value[key], map)
    }
    return result
}

module.exports = deepClone;
