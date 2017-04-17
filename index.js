const p = require('snabbdom/h').default

p.action   = require('./lib/action')
p.combine  = require('./lib/combine')
p.devTools = require('./lib/dev-tools')
p.error    = require('./lib/error')
p.handle   = require('./lib/handle')
p.href     = require('./lib/href')
p.mount    = require('./lib/mount')
p.route    = require('./lib/route')

module.exports = p
