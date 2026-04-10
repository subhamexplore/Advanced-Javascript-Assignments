// Problem Description – Circuit Breaker Promise Wrapper
//
// You are given an async function fn that may fail.
// Your task is to implement circuitBreaker(fn, failureThreshold, resetTimeout).
//
// The circuit breaker must track consecutive failures and manage states:
//
// 1. CLOSED: calls execute normally
// 2. OPEN: after failureThreshold failures, reject immediately without calling fn
// 3. HALF-OPEN: after resetTimeout, allow one trial call to check recovery
//
// If the trial succeeds, reset to CLOSED.
// If it fails, return to OPEN.
function circuitBreaker(fn, failureThreshold, resetTimeout) {
    let state = 'CLOSED'
    let fail = 0
    let next = 0
    return async function(...args){
        const now = Date.now()
        if(state==='OPEN'){
            if(now<next){
                return Promise.reject(new Error("Circuit is OPEN"))
            }
            state = 'HALF-OPEN'
        }
        try {
            const result = await fn(...args)
            fail = 0
            state = 'CLOSED'
            return result
        } catch (err) {
            fail++
            if(fail >= failureThreshold){
                state = 'OPEN'
                next = Date.now() + resetTimeout
            }
            throw err
        }
    }
}

module.exports = circuitBreaker;
