const { curry } = require('tinyfunk')

// handle : a -> { k: ((a, Action) -> a) } -> (a, Action) -> a
const handle = (init, reducers) =>
  (state=init, { type, payload, error }) =>
    reducers[type] ? reducers[type](state, payload, error) : state

module.exports = curry(handle)
