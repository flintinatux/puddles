const curry = require('./curry')

// path : [String] -> { k: v } -> v
const path = ([ head, ...tail ], obj) =>
  tail.length ? path(tail, obj[head]) : obj[head]

module.exports = curry(path)
