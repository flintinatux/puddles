const curryN = require('./curryN')

// curry : (* -> a) -> (* -> a)
const curry = f =>
  curryN(f.length, f)

module.exports = curry
