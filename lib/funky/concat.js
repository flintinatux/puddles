const curry = require('./curry')

// concat : Semigroup a => a -> a -> a
const concat = (a, b) =>
  a.concat(b)

module.exports = curry(concat)
