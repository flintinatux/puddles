const curry = require('./curry')

// assoc : String -> a -> { k: v } -> { k: v }
const assoc = (prop, val, obj) => {
  const res = {}
  for (let key in obj) res[key] = obj[key]
  res[prop] = val
  return res
}

module.exports = curry(assoc)
