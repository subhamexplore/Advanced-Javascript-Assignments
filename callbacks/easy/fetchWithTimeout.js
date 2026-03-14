// Problem Description – fetchWithTimeout(url, ms, callback)
//
// You are required to write a function named fetchWithTimeout that accepts a URL,
// a time limit in milliseconds, and a callback function.
// The function attempts to fetch data from the given URL.
// If the request completes within the specified time, the callback is invoked with
// null as the first argument and the fetched data as the second argument.
// If the operation exceeds the time limit, the callback is invoked with an Error
// whose message is "Request Timed Out".

// function fetchWithTimeout(url, ms, callback) {
//   let finish = false;
//   const timer = setTimeout(() => {
//     if (!finish) {
//       finish = true;
//       callback(new Error("Request Timed Out"));
//     }
//   }, ms);
//   fetch(url, (err, data) => {
//     if (finish) return;
//     finish = true;
//     clearTimeout(timer);
//     if (err) callback(err);
//     else callback(null, data);
//   });
// }

//------------------or---------------------------------

function fetchWithTimeout(url, ms, callback) {
  return new Promise((resolve, reject)=>{
    setTimeout(() => {
      reject("Request Timed Out")
    }, ms);
    fetch(url, (err, data)=>{
      if(err)
          reject(err)
      else
          resolve(data)
    })
  }).then((data)=>callback(null, data)).catch((err)=>callback(err))
}

module.exports = fetchWithTimeout;
