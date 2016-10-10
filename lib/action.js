const curryN = require('ramda/src/curryN')

const action = curryN(2, (type, payload) => ({ type, payload }))

module.exports = action
