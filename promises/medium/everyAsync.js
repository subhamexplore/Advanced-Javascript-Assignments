// Problem Description – everyAsync(array, predicate)

// You are required to implement a function named everyAsync that accepts an array and an asynchronous predicate function. 
// The function should evaluate the predicate for each element and resolve to true only if all predicates return true. 
// The evaluation should stop immediately and resolve to false as soon as any predicate fails.


async function everyAsync(array, predicate) {
    for(let i=0; i<array.length; i++){
        const res = await predicate(array[i])
        if(!res)
            return false
    }
    return true
}

module.exports = everyAsync;

