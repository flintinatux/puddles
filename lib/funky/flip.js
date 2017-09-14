const curry = require('./curry')

// flip : (a -> b -> c) -> (b -> a -> c)
const flip = (f, x, y) =>
  curry(f)(y, x)

module.exports = curry(flip)
