const p = require('snabbdom/h')

p.action  = require('./lib/action')
p.batch   = require('./lib/batch')
p.combine = require('./lib/combine')
p.handle  = require('./lib/handle')
p.href    = require('./lib/href')
p.mount   = require('./lib/mount')
p.route   = require('./lib/route')

module.exports = p
