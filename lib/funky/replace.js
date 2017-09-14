const curry = require('./curry')

// replace : RegExp -> String -> String
const replace = (regexp, replacement, string) =>
  string.replace(regexp, replacement)

module.exports = curry(replace)
