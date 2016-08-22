import curry from 'ramda/src/curry'

const action = curry((type, payload) => ({ type, payload }))

export default action
