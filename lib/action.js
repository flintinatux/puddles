const curry = require('ramda/src/curry')

const action = curry((type, payload) => ({ type, payload }))

module.exports = action
