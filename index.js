const p = require('snabbdom/h').default

p.action  = require('./lib/action')
p.combine = require('./lib/combine')
p.error   = require('./lib/error')
p.handle  = require('./lib/handle')
p.link    = require('./lib/link')
p.mount   = require('./lib/mount')
p.route   = require('./lib/route')

module.exports = p
