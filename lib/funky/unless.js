const curry = require('./curry')

// unless : (a -> Boolean) -> (a -> a) -> a -> a
const unless = (pred, f, x) =>
  pred(x) ? x : f(x)

module.exports = curry(unless)
