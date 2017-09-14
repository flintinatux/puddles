const curry = require('./curry')

// thrush : a -> (a -> b) -> b
const thrush = (x, f) =>
  f(x)

module.exports = curry(thrush)
