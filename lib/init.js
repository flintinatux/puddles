const attrs    = require('snabbdom/modules/attributes').default
const classes  = require('snabbdom/modules/class').default
const events   = require('snabbdom/modules/eventlisteners').default
const snabbdom = require('snabbdom')
const props    = require('snabbdom/modules/props').default
const style    = require('snabbdom/modules/style').default

const link = require('./link')

const init = actions =>
  snabbdom.init([ link(actions), attrs, classes, events, props, style ])

module.exports = init
