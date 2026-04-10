// Problem Description – Yielding a CPU-Intensive Task
//
// You are given a CPU-heavy computation that runs inside a loop.
// Instead of blocking the event loop completely, your task is to
// periodically yield control back to the event loop.
//
// By using setTimeout inside an async function, the computation
// should pause every fixed number of iterations, allowing other
// asynchronous tasks (like timers or I/O callbacks) to run.

async function yieldedCPU(iterations) {
    const CHUNK_SIZE = 100; // yield every 100 iterations
    let result = 0;
    for (let i = 0; i < iterations; i++) {
        result += i; // CPU work
        // Every CHUNK_SIZE iterations, yield to event loop
        if (i % CHUNK_SIZE === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }
    return result;
}

module.exports = yieldedCPU;