const { curry } = require('tinyfunk')

// thunk : Store -> Function -> Action -> ()
const thunk = ({ dispatch, getState }, next, action) => {
  typeof action === 'function'
    ? action(dispatch, getState)
    : next(action)
}

module.exports = curry(thunk)
