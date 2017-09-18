const curry = require('./curry')

// merge : { k: v } -> { k: v } -> { k: v }
const merge = (a, b) =>
  Object.assign({}, a, b)

module.exports = curry(merge)
