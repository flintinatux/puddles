import mapObj from 'ramda/src/mapObjIndexed'

const combine = reducers => (state={}, action) =>
  mapObj((reducer, key) => reducer(state[key], action), reducers)

export default combine
