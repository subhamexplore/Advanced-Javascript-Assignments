// Problem Description – Chained Async Function Execution

// You are required to implement a function that accepts an array of asynchronous functions. 
// Each function should be executed only after the previous one has completed, and it should receive the resolved result of the previous function as its input. 
// The final output should be the result of the last function in the chain.
async function asyncWaterfall(tasks, initialValue) {
    let acc = initialValue
    for(let i=0; i<tasks.length; i++){
        const task = tasks[i]
        acc = await tasks[i](acc)
    }
    return acc
}

module.exports = asyncWaterfall;

