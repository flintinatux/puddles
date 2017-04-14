const compose = require('ramda/src/compose')
const curryN  = require('ramda/src/curryN')
const flyd    = require('flyd')
const prop    = require('ramda/src/prop')
const propEq  = require('ramda/src/propEq')
const when    = require('ramda/src/when')

const DevTools = global.__REDUX_DEVTOOLS_EXTENSION__

const devTools = (dispatch, state) => {
  if (DevTools) {
    const tools = DevTools.connect()
    flyd.combine((d, s) => { tools.send(d(), s()) }, [dispatch, state])
    tools.subscribe(when(
      propEq('type', 'DISPATCH'),
      compose(state, JSON.parse, prop('state'))
    ))
    return tools
  }
}

module.exports = curryN(2, devTools)
