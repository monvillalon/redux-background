const createExecutor = (fn, ...args) => (cb) => {
  // Execute the function
  let result;
  try {
    // Get the result
    result = fn.apply(null, [...args, cb]);
  } catch (err) {
    // If the error raised an error report it
    cb(err, null);
    return;
  }

  // Check if the function returned a promise
  if (result && result.then && result.catch) {
    result.then((value) => {
      cb(null, value);
    })
    .catch((err) => {
      cb(err, null);
    });
    return;
  }

  // Check if the function didn't have a callback
  if (fn.length < 4) {
    cb(null, result);
  }
};

export default createExecutor;
