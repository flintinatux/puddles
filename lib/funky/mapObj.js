const curry = require('./curry')

// mapObj : (v -> k -> v) -> { k: v } -> { k: v }
const mapObj = (f, obj) => {
  const res = {}
  for (let key in obj) res[key] = f(obj[key], key)
  return res
}

module.exports = curry(mapObj)
