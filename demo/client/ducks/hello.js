const { assoc, concat, flip } = require('tinyfunk')
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
