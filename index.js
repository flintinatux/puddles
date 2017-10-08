const p = require('snabbdom/h').default

p.action = require('./lib/action')
p.error  = require('./lib/error')
p.handle = require('./lib/handle')
p.mount  = require('./lib/mount')

module.exports = p
