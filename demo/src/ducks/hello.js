const assoc  = require('ramda/src/assoc')
const concat = require('ramda/src/concat')
const flip   = require('ramda/src/flip')

const p = require('../../..')

const ns = concat('demo/hello/')

const SET_NAME = ns('SET_NAME')

const init = {
  name: 'world'
}

const reducer = p.handle(init, {
  [ SET_NAME ]: flip(assoc('name'))
})

reducer.setName = p.action(SET_NAME)

module.exports = reducer
