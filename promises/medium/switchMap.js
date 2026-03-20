// Problem Description – switchMap(apiCall)

// You are required to implement a utility function named switchMap to handle rapidly triggered asynchronous requests, such as those from a search input.
// When multiple calls are made in quick succession, only the result of the most recent call should be used. 
// If an earlier request resolves after a later one, its result must be ignored

function switchMap(apiCall) {
    let calls = 0;
    return function(...args){
        const latest = ++calls
        return new Promise((resolve, reject)=>{
            apiCall(...args)
            .then((data)=>{
                if(latest === calls) resolve(data)
                else resolve(undefined)
            })
            .catch((err=>{
                if(latest === calls) reject(err)
                else resolve(undefined)
            }))
        })
    }
}

module.exports = switchMap;
