const curry = require('./curry')

// prop : String -> { k: v } -> v
const prop = (key, obj) =>
  obj[key]

module.exports = curry(prop)
