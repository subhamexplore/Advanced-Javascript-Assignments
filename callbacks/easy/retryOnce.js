// Problem Description – retryOnce(fn)
//
// You are given a function `fn` that returns a Promise.
// Your task is to return a new function that calls `fn` and retries it once
// if the first attempt rejects.
// If the second attempt also rejects, the error should be propagated.


function retryOnce(fn) {
  return function(callback){
    fn((err, data)=>{
        if(!err){
            callback(null, data)
        }else{
            fn((err2, data2)=>{
                if(err2){
                    callback(err2, data2)
                }else{
                    callback(null, data2)
                }
            })
        }
    })
  }
}

module.exports = retryOnce;