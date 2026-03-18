
// Problem Description – Race with Winner Information
//
// You are given an object where keys are labels and values are Promises.
// Your task is to implement raceWithMetadata(promiseMap).
//
// The function should behave like Promise.race, but also return which promise won.
//
// It must resolve with an object:
// { winner: <key>, value: <resolved value> }
async function raceWithMetadata(promiseMap) { 
    const res = Object.entries(promiseMap).map(([key, promise])=>{
        return Promise.resolve(promise).then((value)=>({winner: key, value: value}))
    })
    return Promise.race(res)
}

module.exports = raceWithMetadata;
