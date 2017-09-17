const assoc = require('./assoc')
const curry = require('./curry')

// assocPath : [String] -> v -> { k: v } -> { k: v }
const assocPath = ([ head, ...tail ], x, obj) =>
  assoc(head, tail.length ? assocPath(tail, x, obj[head]) : x, obj)

module.exports = curry(assocPath)
