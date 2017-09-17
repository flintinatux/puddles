const { curry } = require('./funky')

// functor : Store -> Function -> Action -> ()
const functor = ({ dispatch, getState }, next, action) => {
  typeof action === 'function'
    ? action(dispatch, getState)
    : next(action)
}

module.exports = curry(functor)
