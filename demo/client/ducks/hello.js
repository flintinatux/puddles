const assoc  = require('ramda/src/assoc')
const concat = require('ramda/src/concat')
const flip   = require('ramda/src/flip')

const p = require('../../..')

const ns = concat('demo/hello/')

const SET_NAME = ns('SET_NAME')

const init = {
  name: 'world'
}

exports.reducer = p.handle(init, {
  [ SET_NAME ]: flip(assoc('name'))
})

exports.actions = {
  setName: p.action(SET_NAME)
}
