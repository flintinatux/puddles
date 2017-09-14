const p = require('../../..')

module.exports = p.combine({
  hello: require('./hello').reducer
})
