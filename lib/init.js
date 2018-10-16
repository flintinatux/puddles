const snabbdom = require('snabbdom')

const link = require('./link')

const init = (actions, hash) =>
  snabbdom.init([
    (actions.route && !hash) ? link(actions) : {},
    require('snabbdom/modules/attributes').default,
    require('snabbdom/modules/class').default,
    require('snabbdom/modules/dataset').default,
    require('snabbdom/modules/eventlisteners').default,
    require('snabbdom/modules/props').default,
    require('snabbdom/modules/style').default
  ])

module.exports = init
