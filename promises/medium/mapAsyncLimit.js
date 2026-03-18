// Problem Description – Asynchronous Map with Concurrency Limit

// You are required to implement an asynchronous version of Array.map that processes items using an async callback function. 
// Unlike the standard map, this version should only process a limited number of items concurrently. 
// As soon as one operation finishes, the next should begin.
// The final result must preserve the original order of the input array.
async function mapAsyncLimit(array, limit, asyncFn) {
    let res = []
    let active = 0
    let index = 0
    while(active<limit && index<array.length){
        let curr = index
        active++
        index++
        res[curr] = await asyncFn(array[curr])
        active--
    }
    return res
}

module.exports = mapAsyncLimit;

