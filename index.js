const p = require('snabbdom/h')

p.action  = require('./lib/action')
p.combine = require('./lib/combine')
p.handle  = require('./lib/handle')
p.mount   = require('./lib/mount')
p.route   = require('./lib/route')

module.exports = p
