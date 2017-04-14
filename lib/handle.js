/* jshint -W138 */
const curryN = require('ramda/src/curryN')

const handle = (init, reducers) =>
  (state=init, { type, payload, error }) =>
    reducers[type] ? reducers[type](state, payload, error) : state

module.exports = curryN(2, handle)
