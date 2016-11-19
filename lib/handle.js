/* jshint -W138 */

const handle = (init, reducers) =>
  (state=init, { type, payload, error }) =>
    reducers[type] ? reducers[type](state, payload, error) : state

module.exports = handle
