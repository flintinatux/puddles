const curryN = require('ramda/src/curryN')

const error = curryN(2, (type, err) => ({ type, payload: err, error: true }))

module.exports = error
