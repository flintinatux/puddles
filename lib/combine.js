const mapObj = require('ramda/src/mapObjIndexed')

const combine = reducers => (state={}, action) =>
  mapObj((reducer, key) => reducer(state[key], action), reducers)

module.exports = combine
