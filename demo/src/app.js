const actions = require('./ducks/actions')
const p       = require('../..')
const reducer = require('./ducks/reducer')
const view    = require('./views/hello')

const root = document.body.querySelector('#root')

const { dispatch } = p.mount({ actions, reducer, root, view })
