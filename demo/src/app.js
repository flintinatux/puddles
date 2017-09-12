const ducks = require('./ducks')
const p     = require('../..')
const view  = require('./views/hello')

const reducer = p.combine(ducks)
const root    = document.body.querySelector('#root')

const { dispatch, state } = p.mount({ actions: ducks, reducer, root, view })

p.devTools(dispatch, state)
