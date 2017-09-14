const curry = require('./curry')

// reduce : Foldable f => (b -> a -> b) -> b -> f a -> b
const reduce = (f, acc, list) =>
  list.reduce(f, acc)

module.exports = curry(reduce)
