const compose = require('ramda/src/compose')
const flyd    = require('flyd')
const prop    = require('ramda/src/prop')
const propEq  = require('ramda/src/propEq')
const when    = require('ramda/src/when')

const devTools = global.__REDUX_DEVTOOLS_EXTENSION__

module.exports = (dispatch, state) => {
  if (devTools) {
    const tools = devTools.connect()
    flyd.combine((d, s) => { tools.send(d(), s()) }, [dispatch, state])
    tools.subscribe(when(
      propEq('type', 'DISPATCH'),
      compose(state, JSON.parse, prop('state'))
    ))
    return tools
  }
}
