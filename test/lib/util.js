exports.spy = () => {
  const calls = []
  const fn = (...args) => {
    calls.push({ args })
    return args[0]
  }
  fn.calls = calls
  return fn
}

exports.wait = fn =>
  setTimeout(fn, 32)
