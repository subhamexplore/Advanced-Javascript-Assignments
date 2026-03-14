// Problem Description – Hedged Request
//
// You have a Primary async source and a Secondary backup.
// Start the Primary immediately. If it is slow, start the Secondary.
//
// Return the first successful result and ignore the rest.
// Only fail if both fail, and ensure the callback runs once.
//
// Requirements:
// - Start Primary immediately.
// - Start Secondary after timeoutMs if needed.
// - First success wins.
// - Callback must be called exactly once.
function hedgedRequest(primary, secondary, timeoutMs, onComplete) {
    let primaryFail = false
    let secondaryFail = false
    let finished = false
    function done(err, data){
        if(finished)
            return
        finished = true
        onComplete(err, data)
    }
    primary((err, data)=>{
        if(err){
            primaryFail = true
            if(secondaryFail)
                done(err)
        }else{
            done(null, data)
        }
    })
    setTimeout(() => {
        secondary((err, data)=>{
            if(err){
                secondaryFail = true
                if(primaryFail)
                    done(err)
            }else{
                done(null, data)
            }
        })
    }, timeoutMs);
}

module.exports = hedgedRequest;
