const { curryN, mapObj } = require('./funky')

// combine : { k: ((a, Action) -> a) } -> { k: a } -> Action -> { k: a }
const combine = (reducers, state={}, axn) =>
  mapObj((reducer, key) => reducer(state[key], axn), reducers)

module.exports = curryN(3, combine)
