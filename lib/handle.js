const handle = (init, reducers) =>
  (state=init, { type, payload }) =>
    reducers[type] ? reducers[type](state, payload) : state

module.exports = handle
